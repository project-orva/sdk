const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const currentTs = () => Date.now() / 1000;

const DEFAULT_JOB_PROPS = {
  lastTriggered: 0,
};

/**
 * JobHandler
 * handles job tasks
 */
export class JobHandler {
/**
 * constructor
 * @param {*} server
 */
  constructor() {
    this.jobs = [];
  }

  /**
   * registerJob
   * @param {*} frequency
   * @param {*} handler
   */
  registerJob(frequency, handler) {
    this.jobs.push({...DEFAULT_JOB_PROPS, frequency, handler});
  }

  /**
   * start
   */
  async start() {
    while (true) {
      this.jobs.forEach((job) => {
        if (job.lastTriggered >= currentTs() + job.frequency) {
          job.handler();
        }
      });

      sleep(1000);
    }
  }
}

export default new JobHandler();
