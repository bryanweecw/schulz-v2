import { capitaliseFirstLetter } from "@/lib/utils"
import { Switch } from "./ui/switch";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ResultCard from "./ResultCard";
import EditForm from "./EditForm";
import { SummaryObjectMap } from "./MeetingNotes";

interface SummaryObject {
    [key: string]: string;
}

interface Props {
    summary: SummaryObjectMap[];
    modifyState: (summaryInfo: SummaryObjectMap[]) => void;
}

const summary = [
    {
        "date": "April 24th, 2023",
        "prospect": "John Smith, Sarah Johnson",
        "company": "Debit Goose",
        "summary": "SP gave a sales pitch highlighting the benefits of their product and how it could help Debit Goose achieve their business goals. JS and SJ then discussed Debit Goose's current needs and challenges, particularly in the area of customer acquisition. SP suggested several ways in which their product could help Debit Goose overcome these challenges. JS and SJ requested a demo of the product, which SP agreed to provide at a later date.",
        "actions": "SP to schedule a demo of the product, Debit Goose to provide SP with more information on their current systems and processes"
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ResultTimeline({ summary, modifyState }: Props) {

    const [showEditForm, setShowEditForm] = useState(false);
    const [currentEdit, setCurrentEdit] = useState<SummaryObjectMap>({ summaryObject: {}, typeFlag: "Edited" })
    const [savedEdit, setSavedEdit] = useState({})
    const editFormRef = useRef<HTMLDivElement>(null);

    const onEditClick = (editState: SummaryObjectMap) => {
        setShowEditForm(true);
        setCurrentEdit(editState);
        // scroll to edit form
        editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const onDiscard = () => {
        setShowEditForm(false);
        setCurrentEdit({ summaryObject: {}, typeFlag: "Edited" });
        setSavedEdit({});
    }

    const onSaveEdit = (editState: SummaryObject) => {
        setShowEditForm(false);
        setCurrentEdit({ summaryObject: {}, typeFlag: "Edited" });
        modifyState([{ summaryObject: editState, typeFlag: "Edited" }, ...summary])
    }

    return (
        <>
            <div ref={editFormRef}>
                {showEditForm
                    ? <EditForm editState={currentEdit["summaryObject"]} saveEditFunction={onSaveEdit} onDiscardFunction={onDiscard} />
                    : <></>
                }
            </div>
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {summary.map((event, eventIdx) => (
                        <ResultCard key={eventIdx} editFunction={onEditClick} summary={event} notLast={eventIdx !== summary.length - 1} />
                    ))}
                </ul>
            </div>
        </>
    )
}
