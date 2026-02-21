const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const yaml = require('js-yaml');

const REPO_OWNER = 'ericgandrade';
const REPO_NAME = 'claude-superskills';
const CACHE_BASE = path.join(os.homedir(), '.claude-superskills', 'cache');
const CACHE_COMPLETE_MARKER = '.cache-complete';

function getGitHubHeaders() {
  return {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'claude-superskills-installer'
  };
}

/**
 * Ensure skills for a given version are cached locally.
 * Downloads from GitHub if not already cached.
 * @param {string} version - e.g. "1.10.3"
 * @returns {string} path to cached skills dir
 */
async function ensureSkillsCached(version) {
  const versionCacheDir = path.join(CACHE_BASE, version, 'skills');
  const markerPath = path.join(versionCacheDir, CACHE_COMPLETE_MARKER);

  if (fs.existsSync(versionCacheDir)) {
    const entries = fs.readdirSync(versionCacheDir).filter(f =>
      fs.statSync(path.join(versionCacheDir, f)).isDirectory()
    );
    if (entries.length > 0 && fs.existsSync(markerPath)) {
      return versionCacheDir;
    }
    // Cache may be partial/corrupted from interrupted downloads.
    await fs.remove(versionCacheDir);
  }

  await fs.ensureDir(versionCacheDir);

  // Try downloading the release tarball first (most reliable)
  try {
    await downloadViaReleaseZip(version, versionCacheDir);
    await writeCacheMarker(versionCacheDir);
    return versionCacheDir;
  } catch (_err) {
    // Fall back to GitHub API tree walk
  }

  try {
    await downloadViaApiTree(version, versionCacheDir);
    await writeCacheMarker(versionCacheDir);
    return versionCacheDir;
  } catch (err) {
    // Never keep partial cache on disk.
    await fs.remove(versionCacheDir);
    throw err;
  }
}

/**
 * Download skills using the GitHub release zipball for a tag.
 */
async function downloadViaReleaseZip(version, targetDir) {
  const AdmZip = requireAdmZip();
  const urls = [
    `https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/tags/v${version}.zip`,
    `https://codeload.github.com/${REPO_OWNER}/${REPO_NAME}/zip/refs/tags/v${version}`
  ];
  let lastError;

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: getGitHubHeaders(),
        maxRedirects: 5,
        timeout: 30000
      });

      const zip = new AdmZip(Buffer.from(response.data));
      const entries = zip.getEntries();
      const prefix = `${REPO_NAME}-${version}/skills/`;

      for (const entry of entries) {
        if (!entry.entryName.startsWith(prefix) || entry.isDirectory) continue;

        const relativePath = entry.entryName.slice(prefix.length);
        if (!relativePath) continue;

        const destPath = path.join(targetDir, relativePath);
        await fs.ensureDir(path.dirname(destPath));
        fs.writeFileSync(destPath, entry.getData());
      }

      const installedSkillDirs = (await fs.readdir(targetDir)).filter(entry =>
        fs.statSync(path.join(targetDir, entry)).isDirectory()
      );
      if (installedSkillDirs.length === 0) {
        throw new Error('zip downloaded but no skills found in archive');
      }

      return;
    } catch (err) {
      lastError = err;
      await fs.emptyDir(targetDir);
    }
  }

  throw lastError || new Error('failed to download release zip');
}

/**
 * Try to require adm-zip, return null if not available.
 */
function requireAdmZip() {
  try {
    return require('adm-zip');
  } catch (_e) {
    throw new Error('adm-zip not available');
  }
}

async function writeCacheMarker(versionCacheDir) {
  const markerPath = path.join(versionCacheDir, CACHE_COMPLETE_MARKER);
  await fs.writeFile(markerPath, `createdAt=${new Date().toISOString()}\n`);
}

/**
 * Download skills by walking the GitHub API tree (no adm-zip needed).
 */
async function downloadViaApiTree(version, targetDir) {
  const ref = `v${version}`;
  const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
  const headers = getGitHubHeaders();

  let treeRes;
  try {
    // Get tree recursively
    treeRes = await axios.get(
      `${apiBase}/git/trees/${ref}?recursive=1`,
      { headers }
    );
  } catch (err) {
    const status = err?.response?.status;
    if (status === 403) {
      throw new Error(
        'GitHub API returned 403 (rate limit or network policy). Retry later or check network policy.'
      );
    }
    throw err;
  }

  const tree = treeRes.data.tree;

  for (const item of tree) {
    if (!item.path.startsWith('skills/')) continue;
    if (item.type !== 'blob') continue;

    const relativePath = item.path.slice('skills/'.length);
    const destPath = path.join(targetDir, relativePath);
    await fs.ensureDir(path.dirname(destPath));

    const blobRes = await axios.get(item.url, { headers });
    const content = Buffer.from(blobRes.data.content, blobRes.data.encoding);
    await fs.writeFile(destPath, content);
  }
}

/**
 * List skills available in the cache for a version.
 * @param {string} version
 * @returns {string[]} skill names
 */
function listCachedSkills(version) {
  const versionCacheDir = path.join(CACHE_BASE, version, 'skills');
  if (!fs.existsSync(versionCacheDir)) return [];
  return fs.readdirSync(versionCacheDir).filter(f =>
    fs.statSync(path.join(versionCacheDir, f)).isDirectory()
  );
}

/**
 * Get skill metadata from cached SKILL.md
 */
function getSkillMetadata(skillName, version) {
  const skillMdPath = path.join(CACHE_BASE, version, 'skills', skillName, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) return { version: 'unknown', description: '' };
  try {
    const content = fs.readFileSync(skillMdPath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) return yaml.load(match[1]);
  } catch (_e) {}
  return { version: 'unknown', description: '' };
}

/**
 * Get the cache base directory path.
 */
function getCacheDir() {
  return CACHE_BASE;
}

/**
 * Clear the entire cache.
 */
async function clearCache() {
  await fs.remove(CACHE_BASE);
}

module.exports = {
  ensureSkillsCached,
  listCachedSkills,
  getSkillMetadata,
  getCacheDir,
  clearCache
};
