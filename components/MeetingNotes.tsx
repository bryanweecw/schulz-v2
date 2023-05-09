"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { ClipLoader } from "react-spinners";
import ResultTimeline from "./ResultTimeline";
import { useSummaryInfoContext } from "./context/SummaryInfoContext";

interface SummaryObject {
  [key: string]: string;
}

export interface SummaryObjectMap {
  summaryObject: SummaryObject;
  typeFlag: "Edited" | "Generated" | "Reprompted";
}

const MeetingNotes = () => {
  const testSummary = {
    "date": "April 24th, 2023",
    "prospect": "John Smith, Sarah Johnson",
    "company": "Debit Goose",
    "summary": "SP gave a sales pitch highlighting the benefits of their product and how it could help Debit Goose achieve their business goals. JS and SJ then discussed Debit Goose's current needs and challenges, particularly in the area of customer acquisition. SP suggested several ways in which their product could help Debit Goose overcome these challenges. JS and SJ requested a demo of the product, which SP agreed to provide at a later date.",
    "actions": "SP to schedule a demo of the product, Debit Goose to provide SP with more information on their current systems and processes"
  }

  const {
    savedSummaryInfo,
    setSavedSummaryInfo,
    savedNotes,
    setSavedNotes
  } = useSummaryInfoContext();

  const [viewMode, setViewMode] = useState<"Markdown" | "Beautified">(
    "Markdown"
  );
  const [notes, setNotes] = useState(savedNotes.current);
  const [rePrompt, setRePrompt] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [revisingSummary, setRevisingSummary] = useState(false);
  const [summaryInfo, setSummaryInfo] = useState<SummaryObjectMap[]>(savedSummaryInfo.current ?? []);
  const [file, setFile] = React.useState<File | null>(null);
  const [generatingTranscript, setGeneratingTranscript] = useState(false);


  useEffect(() => {
    setSavedSummaryInfo({ "current": summaryInfo })
  }, [savedSummaryInfo, setSavedSummaryInfo, summaryInfo]);

  useEffect(() => {
    setSavedNotes({ "current": notes })
  }, [savedNotes, setSavedNotes, notes]);

  // const generateTranscript = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   console.log('triggered')
  //   setGeneratingTranscript(true);
  //   e.preventDefault();
  //   if (!file) {
  //     setGeneratingTranscript(false);
  //     toast({
  //       title: "Error Encountered",
  //       description: "Please upload a valid file",
  //     });
  //     return;
  //   }

  //   const formData = new FormData();
  //   console.log(file.name)
  //   formData.append("body", file);
  //   formData.append("file", file);

  //   fetch("/api/fastapi", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Response:", data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     })
  //     .finally(() => {
  //       setGeneratingTranscript(false);
  //     });
  // };

  const handleViewModeToggle = () => {
    if (viewMode === "Markdown") {
      setViewMode("Beautified");
    } else {
      setViewMode("Markdown");
    }
  };

  const generateSummary = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setGeneratingSummary(true);
    console.log(notes);
    fetch("/api/generate-summary", {
      method: "POST",
      body: JSON.stringify({
        notes,
      }),
    })
      .then(async (res) => {
        const body = await res.json();
        console.log(body)
        console.log(summaryInfo)
        setSummaryInfo([{ summaryObject: body.data.summary, typeFlag: "Generated" }, ...summaryInfo]);
        setGeneratingSummary(false);
      })

      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setGeneratingTranscript(false);
      });
  };

  const reviseSummary = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setRevisingSummary(true);
    fetch("/api/reprompt-summary", {
      method: "POST",
      body: JSON.stringify({
        notes: notes,
        previousResponse: JSON.stringify(summaryInfo[0]["summaryObject"]),
        reprompt: rePrompt,
      }),
    })
      .then(async (res) => {
        const body = await res.json();
        console.log(body)
        setSummaryInfo([{ summaryObject: body.data.summary, typeFlag: "Reprompted" }, ...summaryInfo]);
        setRevisingSummary(false);
      })

      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setGeneratingTranscript(false);
      });
  };

  console.log(summaryInfo)

  return (
    <div className="grid grid-cols-4 space-x-3">
      <div className="flex h-full flex-col space-y-4 col-span-3">
        {viewMode === "Markdown" ? (
          <Textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            placeholder="Write down your meeting notes"
            className="min-h-[200px] flex-1 p-4 md:min-h-[300px] lg:min-h-[400px]"
          />
        ) : (
          <div className="prose-sm list-disc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
          </div>
        )}
        <div>
          {generatingSummary || revisingSummary ?
            (<div className="relative">
              {summaryInfo?.length >= 1 ? (
                <span className="absolute left-1 top-1 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div className="flex align-middle">
                  <span
                    className=
                    'relative top-1.5 bg-yellow-500 h-2 w-2 rounded-full flex items-center justify-center ring-2 ring-white'
                  />
                </div>
                <div className="flex flex-col w-full">
                  <span className="ml-2 text-gray-500 mb-2 text-sm">Generating...</span>
                </div>
              </div>
            </div>)
            : (<></>)}
          {summaryInfo && summaryInfo.length != 0 && (
            <div>
              <ResultTimeline summary={summaryInfo} modifyState={setSummaryInfo} />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <Label htmlFor="necessary" className="flex flex-col space-y-1">
          Input Mode
        </Label>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="necessary" className="flex flex-col space-y-1">
            <span>View Source</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Edit Raw Markdown
            </span>
          </Label>
          <Switch
            id="necessary"
            onCheckedChange={() => handleViewModeToggle()}
            value={viewMode}
          />
        </div>
        {/* {file ? (
          <div className="mb-6">
            <Label htmlFor="Audio Transcript">Audio Transcript</Label>
            <p className="mt-1 mb-3 text-sm text-gray-500">{file.name}</p>
            <div className="flex items-center gap-x-2 ">
              <Button
                className="py-1 px-2 w-full"
                onClick={(e) => {
                  generateTranscript(e);
                }}
                variant="outline"
                disabled={generatingTranscript}
              >
                {generatingTranscript ? (
                  <ClipLoader size={20} speedMultiplier={0.4} />
                ) : (
                  "Generate Transcript"
                )}
              </Button>
              <Button
                className="py-1 px-2 w-full"
                onClick={(e) => {
                  setFile(null);
                }}
                variant="destructive"
                disabled={generatingTranscript}
              >
                Delete File
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
            <Label htmlFor="Audio Transcript">Audio Transcript</Label>
            <Input
              id="Audio Transcript"
              type="file"
              accept=".mp3,.mp4"
              onChange={(e) => {
                const files = e?.target?.files;
                if (files && files.length > 0) {
                  setFile(files[0]);
                }
              }}
            />
            <p className="text-xs text-gray-400">
              Upload an audio transcript and we&apos;ll transcribe it all
            </p>
          </div>
        )} */}

        <Button
          onClick={(e) => generateSummary(e)}
          disabled={generatingSummary}
        >
          {!generatingSummary ? "Generate Summary" : "loading..."}
        </Button>
        {summaryInfo && summaryInfo.length != 0 && (
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
            <Label htmlFor="necessary" className="flex flex-col space-y-1">
              Step 2 : Verify
            </Label>
            <Textarea
              value={rePrompt}
              onChange={(e) => {
                setRePrompt(e.target.value);
              }}
              placeholder="Write feedback here"
              className="min-h-[20px] flex-1 p-4 md:min-h-[20px] lg:min-h-[20px]"
            />
            <div className="flex flex-row gap-2">
              <Button className="w-full"
                onClick={(e) => reviseSummary(e)}
                disabled={revisingSummary}
              >
                {!revisingSummary ? "Reprompt" : "loading..."}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingNotes;
