import Agenda, { Job } from "agenda";
import mongoose from "mongoose";

function time() {
    return new Date().toTimeString().split(" ")[0];
}

// if no collection name is given, default: agendaJobs
export const agenda = new Agenda({
    db: { address: process.env.MONGO_URL || "", collection: "agendaJobs" },
    processEvery: "5 seconds",
});

agenda.define("checkDatabaseConnection", async (job: Job) => {
    const state = mongoose.connection.readyState;

    switch (state) {
        case 0:
            console.log("Agenda: Database is disconnected");
            break;
        case 1:
            console.log("Agenda: Database is connected");
            break;
        case 2:
            console.log("Agenda: Database is connecting");
            break;
        case 3:
            console.log("Agenda: Database is disconnecting");
            break;
        case 99:
            console.log("Agenda: Database is uninitialized");
            break;
    }
    // console.log(mongoose.connection.readyState);
});

interface IData {
    time: Date;
}

agenda.define("testingSchedule", async (job: Job) => {
    const { time } = <IData>job.attrs.data;
    console.log(time);
});

export const initAgenda = async () => {
    try {
        await agenda.start();

        await agenda.every("1 minutes", "checkDatabaseConnection");

        // Log job start and completion/failure
        agenda.on("start", (job) => {
            console.log(time(), `Job <${job.attrs.name}> starting`);
        });

        agenda.on("success", (job) => {
            console.log(time(), `Job <${job.attrs.name}> succeeded`);
        });

        agenda.on("fail", (error, job) => {
            console.log(time(), `Job <${job.attrs.name}> failed:`, error);
        });
    } catch (error) {
        console.log(error);
    }
};
