export type HandlerType = () => void;

export interface Job {
  lastTriggered: number,
  frequency: number,
  handler: HandlerType
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const currentTs = () => Date.now() / 1000;

class JobHandler {
  public jobs: Array<Job> = []

  public registerJob(frequency: number, handler: HandlerType) {
    this.jobs.push({
      lastTriggered: 0,
      frequency,
      handler,
    });
  }

  public async start() {
    while (true) {
      await this.jobs.forEach(async (job: Job) => {
        if (job.lastTriggered >= currentTs() + job.frequency) {
          await job.handler();
        }
      });

      sleep(1000);
    }
  }
}

export default new JobHandler();