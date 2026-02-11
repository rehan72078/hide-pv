import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.media.list.path, async (req, res) => {
    const media = await storage.getMedia();
    res.json(media);
  });

  app.post(api.media.create.path, async (req, res) => {
    const input = api.media.create.input.parse(req.body);
    const item = await storage.createMedia(input);
    res.status(201).json(item);
  });

  app.delete(api.media.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteMedia(id);
    res.json({ success: true });
  });

  return httpServer;
}
