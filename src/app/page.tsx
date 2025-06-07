"use client"
import React from "react"
import { Button } from "@/components/ui/button";
import ReservationForm from "@/components/ReservationForm";
import ReservationList from "@/components/ReservationList";
import { List, Clock, CheckCircle, XCircle } from 'lucide-react';

type FilterType = 'all' | 'pending' | 'qualified' | 'unqualified';

export default function Home() {
  const [currentFilter, setCurrentFilter] = React.useState<FilterType>('all');

  const filterButtons = [
    { key: 'all' as FilterType, label: '全部預約', icon: List },
    { key: 'pending' as FilterType, label: '等待檢查', icon: Clock },
    { key: 'qualified' as FilterType, label: '檢查合格', icon: CheckCircle },
    { key: 'unqualified' as FilterType, label: '檢查不合格', icon: XCircle }
  ];

  return (
    <div className="flex flex-col items-center space-y-6 h-full w-full px-4">
      <ReservationForm />

      <div className="w-full flex justify-center">
        <div className="max-w-md w-full overflow-x-auto pb-2">
          <div className="flex gap-3 whitespace-nowrap">
            {filterButtons.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentFilter === key ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setCurrentFilter(key)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <ReservationList filter={currentFilter} />
    </div>
  );
}
