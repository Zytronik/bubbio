import { PatchNote } from '../_interface/patchNote';

export const patchNotes: PatchNote[] = [
    {
        version: 'Alpha 1.0.0',
        date: '11.10.2024',
        sections: [
            {
                title: 'New Features',
                desc: 'Not really new but, remade the following thing',
                entries: [
                    'Menus and styling',
                    'Aniamtion & Transitions',
                    'Preloading and Loading Screen',
                    'Page Manager',
                    'Global Variables',
                    'User Management',
                    'Auth',
                    'Animations',
                    'Patch Notes',
                    'Folder Structure',
                ],
            },
            {
                title: 'Improvements',
                desc: 'Everything is just cleaner now',
                entries: [
                    'Using Pinia for global Variables now',
                    'New and improved Animation Framework',
                    'Server Side Auth and User Management',
                ],
            },
        ],
    },
];
