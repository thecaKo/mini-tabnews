import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository";
import { DeletePostService } from "@/services/delete-post";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
  const deleteParamsSchema = z.object({
    id: z.string(),
  });

  const prismaPostRepository = new PrismaPostRepository();
  const deletePostService = new DeletePostService(prismaPostRepository);

  const { id } = deleteParamsSchema.parse(request.params);

  await deletePostService.execute({ postId: id, userId: request.user.sub });

  return reply.status(204).send({ message: "Post deleted!" });
}
