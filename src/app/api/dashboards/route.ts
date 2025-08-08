
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'dashboards.json');
const MAX_DASHBOARDS = 10;

// This is a placeholder function. In a real application, you would save to a database.
async function saveDashboardToDb(layouts: any[]) {
    console.log("Saving to database (simulation):", JSON.stringify(layouts, null, 2));
    // Replace with your actual database saving logic, e.g.:
    // await db.collection('dashboards').doc('user1').set({ layouts });
    return Promise.resolve();
}

async function readDashboards() {
    try {
        await fs.access(dataFilePath);
        const jsonData = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        // If the file doesn't exist, return an empty array
        return [];
    }
}

async function writeDashboards(data: any) {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    // Also call the placeholder DB function
    await saveDashboardToDb(data);
}

export async function GET() {
    try {
        const dashboards = await readDashboards();
        return NextResponse.json(dashboards);
    } catch (error) {
        console.error('Failed to read dashboards:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newLayout = await request.json();
        if (!newLayout.name || !newLayout.qualitative) {
            return new NextResponse('Bad Request: Missing name or layout data', { status: 400 });
        }

        const dashboards = await readDashboards();
        
        if (dashboards.length >= MAX_DASHBOARDS) {
             return new NextResponse(`Cannot save more than ${MAX_DASHBOARDS} dashboards.`, { status: 400 });
        }

        dashboards.push(newLayout);

        await writeDashboards(dashboards);

        return NextResponse.json(dashboards, { status: 201 });

    } catch (error) {
        console.error('Failed to save dashboard:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
