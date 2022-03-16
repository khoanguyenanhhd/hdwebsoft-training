import Bull, { Job, JobOptions } from "bull";

import { emailProcess } from "../services/emailProcess";

const emailQueue = new Bull("emailQueue", "redis://127.0.0.1:6379");
const dummyQueue = new Bull("emailQueue", "redis://127.0.0.1:6379/1");

// Remember to handle jobs when completed or failed
// A job still in queue when it finished
const emailJobOptions: JobOptions = {
    removeOnComplete: true,
    removeOnFail: true,
};

export const addEmailToQueue = async <T>(model: T) => {
    await emailQueue.add(model, emailJobOptions);
};

export const addDummyToQueue = async <T>(model: T) => {
    await dummyQueue.add(model, emailJobOptions);
};

emailQueue.process(emailProcess);

dummyQueue.process(async (job: Job) => {
    console.log("Second queue");
});

emailQueue.on("global:completed", (jobId) => {
    console.log(`Job with id ${jobId} has been completed`);
});
