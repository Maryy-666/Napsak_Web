import { PUBLIC_MEMBERS, PublicMember } from "../data/members";

export let inMemoryMembers: PublicMember[] = [...PUBLIC_MEMBERS];

export function getInMemoryMembers(): PublicMember[] {
  return inMemoryMembers;
}

export function addInMemoryMember(newMember: PublicMember) {
  inMemoryMembers.unshift(newMember);
}

export function removeInMemoryMember(id: string) {
  inMemoryMembers = inMemoryMembers.filter(
    (m) => m.id !== id && m.memberProfileId?.toString() !== id
  );
}

export function updateInMemoryMember(id: string, fields: Partial<PublicMember>) {
  const index = inMemoryMembers.findIndex(
    (m) => m.id === id || m.memberProfileId?.toString() !== id
  );
  if (index !== -1) {
    inMemoryMembers[index] = { ...inMemoryMembers[index], ...fields };
  }
}
