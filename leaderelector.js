import {Mutex} from 'async-mutex';
import express from 'express';

const app = express();
const mutex = new Mutex();
var currentLeader = "";
var leaseEnd = new Date();
var leaseTime = process.env.LEASE_TIME ?? "10";

app.listen(3003, function() {
    console.log("Starting leader elector on port 3003");
    console.log("Using lease time: " + leaseTime + " minutes");
});

app.get("/ProceedAsLeader", async (req,res) => {
    console.log(req.query.caller + " trying to become leader ");
    
    await mutex.runExclusive(async () => {
        if (leaseEnd < Date.now()) {
            // Lease expired (or first caller), setting current requester as leader
            currentLeader = req.query.caller;
            console.log("Lease expired! Setting new leader: " + currentLeader);            
        }

        if (currentLeader === req.query.caller) {
            // New lease window             
            leaseEnd = new Date(Date.now() + leaseTime*60000);
            console.log("Leader: " + currentLeader);
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

