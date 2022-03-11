import Bull, { Job, JobOptions } from "bull";
import { ITodo } from "../models/Todo";
import { emailProcess } from "../services/emailProcess";

const emailQueue = new Bull("emailQueue", "redis://127.0.0.1:6379");
const dummyQueue = new Bull("emailQueue", "redis://127.0.0.1:6379");

// Remember to handle jobs when completed or failed
// A job still in queue when it completed
const emailJobOptions: JobOptions = {
    removeOnComplete: true,
    removeOnFail: true,
};

export const addEmailToQueue = async (todo: ITodo) => {
    await emailQueue.add(todo, emailJobOptions);
};

export const addDummyToQueue = async (todo: ITodo) => {
    await dummyQueue.add(todo, emailJobOptions);
};

emailQueue.process(emailProcess);

dummyQueue.process(async (job: Job) => {
    console.log("Second queue");
});

emailQueue.on("global:completed", (jobId) => {
    console.log(`Job with id ${jobId} has been completed`);
});
