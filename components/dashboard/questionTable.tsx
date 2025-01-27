/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, DragEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

import { GripHorizontal } from "lucide-react";
import { Eye, Message } from "iconsax-react";

interface Question {
  id: number;
  label: string;
  name: string;
  type: string;
  required: number;
  options?: any;
  placeholder?: string;
}

interface QuestionTableProps {
  questions: Question[];
}

const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
  const [data, setData] = useState<Question[]>(questions);
  const draggedItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  const handleDragStart = (
    e: DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    draggedItemRef.current = index;
    e.dataTransfer?.setData("text/plain", "");
  };

  const handleDragEnter = (index: number) => {
    dragOverItemRef.current = index;
  };

  const handleDragEnd = () => {
    if (draggedItemRef.current !== null && dragOverItemRef.current !== null) {
      const updatedData = [...data];
      const [removedItem] = updatedData.splice(draggedItemRef.current, 1);
      updatedData.splice(dragOverItemRef.current, 0, removedItem);

      setData(updatedData);
    }
    draggedItemRef.current = null;
    dragOverItemRef.current = null;
  };

  const toggleRequired = (index: number) => {
    const updatedData = [...data];
    updatedData[index].required = updatedData[index].required ? 0 : 1;
    setData(updatedData);
  };

  return (
    <div className="w-full rounded">
      <div className="p-4 font-bold border-b border-[#F2F2F2]">
        {data.length} Questions
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Question Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((question, index) => (
            <TableRow
              key={question.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`
                hover:bg-gray-50
                ${
                  dragOverItemRef.current === index ? "bg-gray-200" : ""
                } cursor-move   ${
                index !== data.length - 1 ? "border-b border-[#F2F2F2]" : ""
              }
                cursor-move
              `}
            >
              <TableCell className="w-[20px] text-muted-foreground">
                <GripHorizontal className="h-4 w-4" />
              </TableCell>
              <TableCell>{question.label}</TableCell>
              <TableCell>{question.type}</TableCell>
              <TableCell>
                <Switch
                  className="scale-75"
                  checked={question.required === 1}
                  onCheckedChange={() => toggleRequired(index)}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1  flex items-center bg-[#F8F8F8] rounded-full">
                    <span className="mr-2">
                      <Eye size="16" color="#000" />
                    </span>
                    View
                  </button>
                  <button className="text-[#3365E3] bg-[#cad6f5] text-xs px-2 py-1 flex items-center rounded-full">
                    <span className="mr-2">
                      <Message size="14" color="#3365E3" />
                    </span>
                    <span> Review</span>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionTable;
