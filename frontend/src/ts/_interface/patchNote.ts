export interface PatchNote {
    version: string;
    date: string;
    sections: PatchNoteSection[];
}

export interface PatchNoteSection {
    title: string;
    desc?: string;
    entries?: string[];
}
