import { getSession } from "@/app/lib/session";
import { prisma } from "@/backend/src/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const trips = await prisma.trip.findMany({
    where: {
      ownerId: session.user.id,
    },
  });

  return Response.json(trips);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { title, startDate, endDate, destination } = await req.json();

  const trip = await prisma.trip.create({
    data: {
      title,
      startDate,
      endDate,
      destination,
      ownerId: session.user.id,
    },
  });

  return Response.json(trip);
}
