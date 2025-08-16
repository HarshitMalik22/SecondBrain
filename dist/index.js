import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { LinkModel, UserModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";
import { ContentModel } from "./db.js";
import { random } from "./utils.js";
const app = express();
app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            username: username,
            password: password
        });
        res.json({
            message: "User signed up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User already exists"
        });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id,
        }, JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Invalid credentials"
        });
    }
});
app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    //@ts-ignore
    const userId = req.userId;
    await ContentModel.create({
        link,
        type,
        userId: userId,
        authorId: userId, // Set both userId and authorId to the same value
        tags: []
    });
    res.json({
        message: "Content added"
    });
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        message: "Content deleted"
    });
});
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = random(10);
        LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.json({
            message: "/share" + hash
        });
    }
    else {
        LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "Removed Link"
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    });
    const user = await UserModel.findOne({
        userId: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "User not found"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
});
app.listen(3000);
//# sourceMappingURL=index.js.map