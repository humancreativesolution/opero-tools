import { atomic } from "@libs/state";

export const errorAtom = atomic<Error | null>(null);