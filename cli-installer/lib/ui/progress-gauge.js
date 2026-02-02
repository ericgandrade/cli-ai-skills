const chalk = require('chalk');

/**
 * Visual progress gauge for multi-step operations
 * Creates a progress bar like: [████████████░░░░░░] 60% - Step 3/5: Installing skills
 */
class ProgressGauge {
  constructor(totalSteps) {
    this.totalSteps = totalSteps;
    this.currentStep = 0;
    this.barLength = 20; // Total characters in the progress bar
  }

  /**
   * Update progress to next step
   * @param {string} stepName - Description of current step
   */
  next(stepName) {
    this.currentStep++;
    this.render(stepName);
  }

  /**
   * Set progress to specific step
   * @param {number} step - Step number (1-indexed)
   * @param {string} stepName - Description of current step
   */
  setStep(step, stepName) {
    this.currentStep = step;
    this.render(stepName);
  }

  /**
   * Render the progress gauge
   * @param {string} stepName - Description of current step
   */
  render(stepName = '') {
    const percentage = Math.round((this.currentStep / this.totalSteps) * 100);
    const filledLength = Math.round((this.currentStep / this.totalSteps) * this.barLength);
    const emptyLength = this.barLength - filledLength;

    // Create the visual bar
    const filledBar = '█'.repeat(filledLength);
    const emptyBar = '░'.repeat(emptyLength);
    const bar = chalk.cyan(filledBar) + chalk.dim(emptyBar);

    // Format the output
    const percentageStr = chalk.bold(`${percentage}%`);
    const stepStr = chalk.dim(`Step ${this.currentStep}/${this.totalSteps}`);
    const nameStr = stepName ? chalk.white(`: ${stepName}`) : '';

    console.log(`[${bar}] ${percentageStr} - ${stepStr}${nameStr}`);
  }

  /**
   * Mark as complete
   */
  complete(message = 'Complete!') {
    this.currentStep = this.totalSteps;
    const bar = chalk.green('█'.repeat(this.barLength));
    console.log(`[${bar}] ${chalk.green.bold('100%')} - ${chalk.green(message)}`);
  }

  /**
   * Create a simple inline gauge (single line, no steps)
   * @param {number} current - Current value
   * @param {number} total - Total value
   * @param {string} label - Label to display
   * @returns {string} Formatted gauge string
   */
  static inline(current, total, label = '') {
    const percentage = Math.round((current / total) * 100);
    const barLength = 15;
    const filledLength = Math.round((current / total) * barLength);
    const emptyLength = barLength - filledLength;

    const filledBar = chalk.cyan('█'.repeat(filledLength));
    const emptyBar = chalk.dim('░'.repeat(emptyLength));
    
    const labelStr = label ? `${label} ` : '';
    return `${labelStr}[${filledBar}${emptyBar}] ${chalk.bold(percentage + '%')}`;
  }

  /**
   * Create a compact gauge for lists
   * @param {number} current - Current value
   * @param {number} total - Total value
   * @returns {string} Compact gauge (just the bar)
   */
  static compact(current, total) {
    const percentage = Math.round((current / total) * 100);
    const barLength = 10;
    const filledLength = Math.round((current / total) * barLength);
    const emptyLength = barLength - filledLength;

    const filledBar = '█'.repeat(filledLength);
    const emptyBar = '░'.repeat(emptyLength);
    
    return `[${chalk.cyan(filledBar)}${chalk.dim(emptyBar)}]`;
  }

  /**
   * Render a multi-operation progress summary
   * @param {Object} stats - Statistics object { completed, failed, total }
   */
  static summary(stats) {
    const { completed = 0, failed = 0, total = 0 } = stats;
    const skipped = total - completed - failed;

    console.log(chalk.cyan('\n📊 Progress Summary:\n'));
    
    if (completed > 0) {
      const gauge = ProgressGauge.compact(completed, total);
      console.log(`  ${gauge} ${chalk.green(`✅ Completed: ${completed}`)}`);
    }
    
    if (failed > 0) {
      const gauge = ProgressGauge.compact(failed, total);
      console.log(`  ${gauge} ${chalk.red(`❌ Failed: ${failed}`)}`);
    }
    
    if (skipped > 0) {
      const gauge = ProgressGauge.compact(skipped, total);
      console.log(`  ${gauge} ${chalk.yellow(`⏭️  Skipped: ${skipped}`)}`);
    }

    const overallGauge = ProgressGauge.compact(completed, total);
    console.log(`\n  ${overallGauge} ${chalk.bold(`Overall: ${completed}/${total} successful`)}`);
  }
}

module.exports = ProgressGauge;
