"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Clock, BookOpen } from "lucide-react"

export default function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25) // minutes
  const [restTime, setRestTime] = useState(5) // minutes
  const [currentTime, setCurrentTime] = useState(25 * 60) // seconds
  const [isActive, setIsActive] = useState(false)
  const [isWorkSession, setIsWorkSession] = useState(true)
  const [totalStudyTime, setTotalStudyTime] = useState(0) // total minutes studied
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [originalTitle] = useState("Pomodoro Timer")
  const titleBlinkRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((time) => time - 1)
      }, 1000)
    } else if (currentTime === 0) {
      if (isWorkSession) {
        setTotalStudyTime((prev) => prev + workTime)
        setCompletedSessions((prev) => prev + 1)
        setCurrentTime(restTime * 60)
        setIsWorkSession(false)
        startTitleBlink("🎉 Work Session Complete! Time for a break!")
      } else {
        setCurrentTime(workTime * 60)
        setIsWorkSession(true)
        startTitleBlink("💪 Break Time Over! Ready to work?")
      }
      setIsActive(false)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, currentTime, workTime, restTime, isWorkSession])

  const startTitleBlink = (message: string) => {
    let isOriginal = true
    titleBlinkRef.current = setInterval(() => {
      document.title = isOriginal ? message : originalTitle
      isOriginal = !isOriginal
    }, 1000)

    setTimeout(() => {
      if (titleBlinkRef.current) {
        clearInterval(titleBlinkRef.current)
        document.title = originalTitle
      }
    }, 10000)
  }

  const startTimer = () => {
    setIsActive(true)
  }

  const pauseTimer = () => {
    setIsActive(false)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsWorkSession(true)
    setCurrentTime(workTime * 60)
  }

  const handleWorkTimeChange = (value: number[]) => {
    const newWorkTime = value[0]
    setWorkTime(newWorkTime)
    if (isWorkSession && !isActive) {
      setCurrentTime(newWorkTime * 60)
    }
  }

  const handleRestTimeChange = (value: number[]) => {
    const newRestTime = value[0]
    setRestTime(newRestTime)
    if (!isWorkSession && !isActive) {
      setCurrentTime(newRestTime * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Study Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <BookOpen className="h-5 w-5" />
                  Study Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{formatStudyTime(totalStudyTime)}</div>
                  <p className="text-sm text-muted-foreground">Total Study Time</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-semibold text-card-foreground">{completedSessions}</div>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-center">
                    {isWorkSession ? "Work Session" : "Rest Break"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Timer Section */}
          <div className="lg:col-span-3">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Pomodoro Timer</h1>
              <p className="text-muted-foreground">Stay focused and productive with timed work sessions</p>
            </div>

            {/* Timer Display */}
            <Card className="mb-8 bg-card border-border">
              <CardContent className="pt-8">
                <div className="text-center">
                  <div className="text-8xl font-mono font-bold text-primary mb-4">{formatTime(currentTime)}</div>
                  <div className="flex justify-center gap-4 mb-6">
                    <Button
                      onClick={isActive ? pauseTimer : startTimer}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isActive ? (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button onClick={resetTimer} variant="outline" size="lg" className="border-border bg-transparent">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Clock className="h-5 w-5" />
                    Work Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-semibold text-card-foreground">{workTime} min</span>
                    </div>
                    <Slider
                      value={[workTime]}
                      onValueChange={handleWorkTimeChange}
                      max={60}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={isActive}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Clock className="h-5 w-5" />
                    Rest Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-semibold text-card-foreground">{restTime} min</span>
                    </div>
                    <Slider
                      value={[restTime]}
                      onValueChange={handleRestTimeChange}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={isActive}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 min</span>
                      <span>30 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
