import { Document } from 'mongoose';

export interface ITreeNode {
  monsterId: string; // monster slug
  children: ITreeNode[];
}

export default interface IEvolutionTree extends Document {
  name: string;
  slug: string;
  description?: string;
  nodes: ITreeNode[];
  createdAt: Date;
  updatedAt: Date;
}
