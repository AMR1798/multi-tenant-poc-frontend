// {
//     "id": 1,
//     "createdBy": 10,
//     "tenantId": 4,
//     "title": "Test Note",
//     "type": "NOTE",
//     "access": "TENANT",
//     "pinned": false,
//     "createdAt": "2023-12-28T05:10:15.997Z",
//     "updatedAt": "2023-12-28T05:10:15.997Z",
//     "deletedAt": null,
//     "note": {
//         "resourceId": 1,
//         "content": "idk"
//     },
//     "user": {
//         "id": 10,
//         "name": "bbb2"
//     }
// }

interface BaseResource {
    id: number;
    createdBy: number;
    tenantId: number;
    title: string;
    type: "NOTE";
    access: "TENANT" | "PRIVATE" | "PUBLIC";
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
    user: {
        id: number;
        name: number;
    }
}

interface Note {
    resourceId: number,
    content: string;
    delta: Op[] | { ops: Op[]; } | undefined
}


interface NoteResource extends BaseResource {
    note: Note
}