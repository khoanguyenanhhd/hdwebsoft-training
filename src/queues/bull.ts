import Bull, { Job } from "bull";
import { ITodo } from "../models/Todo";
import { emailProcess } from "../services/emailProcess";

//
const emailQueue = new Bull("emailQueue", "redis://127.0.0.1:6379");
const secondQueue = new Bull("emailQueue", "redis://127.0.0.1:6379");

export const addEmailToQueue = async (todo: ITodo) => {
    await emailQueue.add(todo);
};

export const addSecondToQueue = async (todo: ITodo) => {
    await secondQueue.add(todo);
};

emailQueue.process(emailProcess);

secondQueue.process(async (job: Job) => {
    console.log("Second queue");
});

emailQueue.on("global:completed", (jobId) => {
    console.log(`Job with id ${jobId} has been completed`);
});
