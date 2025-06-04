import * as React from "react"
import { Button } from "@/components/ui/button";
import ReservationForm from "@/components/ReservationForm";
import ReservationList from "@/components/ReservationList";
import { List, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-6 h-full w-full px-4">
      <ReservationForm />

      <div className="w-full flex justify-center">
        <div className="max-w-md w-full overflow-x-auto pb-2">
          <div className="flex gap-3 whitespace-nowrap">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <List className="h-4 w-4" />
              全部預約
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              等待檢查
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              檢查合格
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              檢查不合格
            </Button>
          </div>
        </div>
      </div>

      <ReservationList />
    </div>
  );
}