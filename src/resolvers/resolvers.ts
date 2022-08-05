import { createPubSub } from "@graphql-yoga/node";
import { db } from "./db";

const pubSub = createPubSub();

export const resolvers = {
  Query: {
    donuts: (_: any) => db.donuts,
    donut: (_: any, { id }: { id: number }) => {
      const donutIndex = db.donuts.findIndex((donut: any) => donut.id === id);
      if (donutIndex === -1) {
        return null;
      }
      const donut = db.donuts[donutIndex];
      return donut;
    },
  },
  Mutation: {
    addDonut: (_: any, { input }: { input: any }) => {
      const donut = {
        id: db.donuts.length + 1,
        name: input.name,
        price: input.price,
      };
      db.donuts.push(donut);
      pubSub.publish("addDonut", donut);
      return donut;
    },
    editDonut: (_: any, { id, input }: { id: number; input: any }) => {
      const donutIndex = db.donuts.findIndex((donut: any) => donut.id === id);
      if (donutIndex === -1) {
        return null;
      }
      const donut = db.donuts[donutIndex];
      donut.name = input.name;
      donut.price = input.price;
      db.donuts[donutIndex] = donut;
      pubSub.publish("editDonut", donut);
      return donut;
    },
    deleteDonut: (_: any, { id }: { id: number }) => {
      const donutIndex = db.donuts.findIndex((donut: any) => donut.id === id);
      if (donutIndex === -1) {
        return null;
      }
      const donut = db.donuts[donutIndex];
      db.donuts.splice(donutIndex, 1);
      pubSub.publish("deleteDonut", donut);
      return donut;
    },
  },
  Subscription: {
    addDonut: {
      subscribe: () => pubSub.subscribe("addDonut"),
      resolve: (payload: any) => payload,
    },
    editDonut: {
      subscribe: () => pubSub.subscribe("editDonut"),
      resolve: (payload: any) => payload,
    },
    deleteDonut: {
      subscribe: () => pubSub.subscribe("deleteDonut"),
      resolve: (payload: any) => payload,
    },
  },
};