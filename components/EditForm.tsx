import { capitaliseFirstLetter } from "@/lib/utils"
import { SummaryObject } from "./ResultCard"
import { Switch } from "./ui/switch"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { SummaryObjectMap } from "./MeetingNotes"

interface EditFormProps {
    editState: SummaryObject
    saveEditFunction: (editState: SummaryObject) => void
    onDiscardFunction: () => void
}

export default function EditForm({ editState, saveEditFunction, onDiscardFunction }: EditFormProps) {

    const [viewMode, setViewMode] = useState<"Markdown" | "Beautified">(
        "Beautified"
    );
    const [activeEdits, setActiveEdits] = useState<SummaryObject>(editState);

    const handleViewModeToggle = () => {
        if (viewMode === "Markdown") {
            setViewMode("Beautified");
        } else {
            setViewMode("Markdown");
        }
    };

    return (
        <div className="ml-2 col-span-3 rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5 mb-5">
            {viewMode == "Markdown"
                ? (
                    <div className="p-3">
                        <Textarea
                            value={JSON.stringify(activeEdits, null, 2)}
                            contentEditable={true}
                            placeholder="Write down your meeting notes"
                            className="bg-white w-full min-h-[200px] flex-1 p-5 md:min-h-[300px] lg:min-h-[400px] text-xs"
                            onChange={(e) => { setActiveEdits(JSON.parse(e.target.value)) }}
                        />
                    </div>
                )
                : (<dl className="flex flex-wrap">
                    <div className="flex-auto py-1 px-3">
                        {Object.entries(activeEdits).map(([key, value]) => {
                            return (
                                <div key={key} className="flex-auto py-2">
                                    <dt className="text-sm font-semibold leading-6 text-gray-900">{capitaliseFirstLetter(key)}:</dt>
                                    {/* <dd className="mt-1 text-xs font-semibold leading-6 text-gray-900">{value}</dd> */}
                                    <Textarea
                                        contentEditable={true}
                                        value={value}
                                        className="w-full flex-1 bg-white text-xs"
                                        onChange={(e) => {
                                            setActiveEdits({ ...activeEdits, [key]: e.target.value })
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </dl>)}
            <div className="flex flex-auto py-2 px-3 h-fit justify-between">
                <div className="flex flex-auto h-fit gap-1 my-auto">
                    <span className="inline-block text-gray-500 align-middle my-auto text-sm">View JSON</span>
                    <Switch
                        id="necessary"
                        onCheckedChange={() => handleViewModeToggle()}
                        value={viewMode}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <Button className="w-1/2"
                        onClick={() => { onDiscardFunction() }}
                    >
                        Discard
                    </Button>
                    <Button className="w-1/2 bg-violet-500 hover:bg-violet-600"
                        onClick={() => { saveEditFunction(activeEdits) }}
                        disabled={JSON.stringify(activeEdits) == JSON.stringify(editState)}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}