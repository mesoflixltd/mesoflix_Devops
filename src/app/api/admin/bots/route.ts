import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BOTS_DIR = 'C:\\Users\\Administrator\\Desktop\\deriv2026\\mesoflix_Bot\\public\\bots';
const MANIFEST_PATH = path.join(BOTS_DIR, 'manifest.json');

export async function GET() {
    try {
        const manifestData = await fs.readFile(MANIFEST_PATH, 'utf8');
        return NextResponse.json({ bots: JSON.parse(manifestData) });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const botDataStr = formData.get('botData') as string | null;

        if (!botDataStr) {
            return NextResponse.json({ error: 'Missing bot metadata' }, { status: 400 });
        }

        const botData = JSON.parse(botDataStr);

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(path.join(BOTS_DIR, botData.name), buffer);
        }

        let manifest = [];
        try {
            const manifestData = await fs.readFile(MANIFEST_PATH, 'utf8');
            manifest = JSON.parse(manifestData);
        } catch (e) {
            // manifest might not exist
        }

        manifest.unshift(botData);
        await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 4));

        return NextResponse.json({ success: true, bot: botData });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, updatedData } = body;

        let manifest = [];
        try {
            const manifestData = await fs.readFile(MANIFEST_PATH, 'utf8');
            manifest = JSON.parse(manifestData);
        } catch (e) {
            return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
        }

        const index = manifest.findIndex((b: any) => b.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
        }

        // If filename changed, we should rename the file
        if (updatedData.name && updatedData.name !== manifest[index].name) {
            const oldPath = path.join(BOTS_DIR, manifest[index].name);
            const newPath = path.join(BOTS_DIR, updatedData.name);
            try {
                await fs.rename(oldPath, newPath);
            } catch (renameErr) {
                console.error('File rename failed or file missing:', renameErr);
            }
        }

        manifest[index] = { ...manifest[index], ...updatedData };
        await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 4));

        return NextResponse.json({ success: true, bot: manifest[index] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        let manifest = [];
        try {
            const manifestData = await fs.readFile(MANIFEST_PATH, 'utf8');
            manifest = JSON.parse(manifestData);
        } catch (e) {
            return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
        }

        const bot = manifest.find((b: any) => b.id === id);
        if (bot) {
            const filePath = path.join(BOTS_DIR, bot.name);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Failed to delete XML file:', err);
            }
        }

        const newManifest = manifest.filter((b: any) => b.id !== id);
        await fs.writeFile(MANIFEST_PATH, JSON.stringify(newManifest, null, 4));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
