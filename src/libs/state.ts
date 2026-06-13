import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type Atom,
  type Getter,
} from "jotai";
import { useImmerAtom } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

export function atomicSelector<Value>(
  read: (get: Getter) => Value,
): Atom<Value> {
  return atom<Value>(read);
}

export const atomic = atom;

export const atomicStorage = atomWithStorage;

export const useAtomic = useAtom;

export const useAtomicValue = useAtomValue;

export const useAtomicSetter = useSetAtom;

export const useAtomicImmer = useImmerAtom;
