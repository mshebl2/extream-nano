import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InternalLinkMapping from '@/models/InternalLinkMapping';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
    await connectDB();
    try {
        const { id } = await params;
        const body = await req.json();

        // Remove _id from body if present to avoid immutable field error
        delete body._id;

        const updatedMapping = await InternalLinkMapping.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedMapping) {
            return NextResponse.json({ message: 'Mapping not found' }, { status: 404 });
        }

        return NextResponse.json(updatedMapping);
    } catch (error: any) {
        console.error('Error updating link mapping:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    await connectDB();
    try {
        const { id } = await params;

        const deletedMapping = await InternalLinkMapping.findByIdAndDelete(id);

        if (!deletedMapping) {
            return NextResponse.json({ message: 'Mapping not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Mapping deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting link mapping:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
