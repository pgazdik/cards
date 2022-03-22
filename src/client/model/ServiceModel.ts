import { Identifiable } from './DataModel';

export interface CardsRequest {
    test?: boolean;
}

export interface NewNode {
    
}

export interface NewNodeRequest extends CardsRequest {
    parentId: string;
    node: Identifiable;
}
