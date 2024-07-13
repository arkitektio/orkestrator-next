import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { FiPlay } from "react-icons/fi";
import { RiStopLine } from "react-icons/ri";
import Timestamp from "react-timestamp";
import {
  DetailRunFragment,
  RunEventFragment,
  useEventsBetweenLazyQuery,
} from "../../../api/graphql";
import { useTrackRiver } from "../../context";

export const RangeTracker = ({ run }: { run: DetailRunFragment }) => {
  const { setRunState } = useTrackRiver();

  const [t, setT] = useState(0);
  const [play, setPlay] = useState(false);
  const [triggerRange, setTriggerRange] = useState({ min: 0, max: 10 });

  const [range, setRange] = useState({ min: 0, max: 100, marks: [0] });

  const [rangeEvents, setRangeEvents] = useState<
    (RunEventFragment | null | undefined)[]
  >([]);

  const [fetchInbetweenEvents] = useEventsBetweenLazyQuery();

  useEffect(() => {
    let newEvents = rangeEvents?.reduce((prev, event) => {
      if (event && event.t <= t) {
        let prev_node = prev?.find((i) => i.source === event?.source);
        if (prev_node) {
          if (prev_node.t <= event.t) {
            return prev.map((i) => (i.source === event.source ? event : i));
          }
          return prev;
        }
        return [...prev, event];
      }
      return prev;
    }, [] as RunEventFragment[]);

    console.log(newEvents);
    setRunState({ t: t, events: newEvents });
  }, [rangeEvents, t]);

  useEffect(() => {
    if (play) {
      const interval = setInterval(() => {
        setT((t) => (t > range.max ? 0 : t + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [play, range]);

  useEffect(() => {
    let array = run?.snapshots?.map((snapshot) => snapshot.t) || [0, 100];
    console.log("Snapshots", array);

    setRange({
      min: Math.min(...array),
      max: Math.max(...array),
      marks: array,
    });
  }, [run?.snapshots]);

  useEffect(() => {
    if (t > triggerRange.max || t < triggerRange.min) {
      setTriggerRange({ min: t, max: t + 80 });
    }
  }, [t, triggerRange]);

  useEffect(() => {
    console.log("Changing t", t);
    setRunState((state) => ({
      t: t,
      events: state?.events?.filter((event) => event && event?.t <= t),
    }));
  }, [t]);

  useEffect(() => {
    console.log("fetching events");

    fetchInbetweenEvents({
      variables: {
        id: run.id,
        min: triggerRange.min,
        max: triggerRange.max,
      },
    })
      .then((res) => {
        console.error(res.data?.eventsBetween);
        setRangeEvents(res.data?.eventsBetween || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [triggerRange, fetchInbetweenEvents, run.id]);

  return (
    <div className="flex flex-row z-50">
      <div
        className="flex-initial my-auto mr-4 dark:text-white cursor-pointer my-auto"
        onClick={() => setPlay(!play)}
      >
        {play ? <RiStopLine size={"1em"} /> : <FiPlay size={"1em"} />}
      </div>

      <div className="flex-grow relative group my-auto">
        <Card
          className="group-hover:opacity-100 opacity-0 absolute w-20 h-13 p-1  translate-x-[-50%] translate-y-[-120%] flex items-center justify-center bg-gray-900 dark:bg-gray-800 rounded-md shadow-md"
          style={{
            left: `${((t - range.min) / (range.max - range.min)) * 100}%`,
          }}
        >
          <Timestamp
            date={rangeEvents.find((e) => e?.t == t)?.createdAt}
            relative
            className="text-xs dark:text-white my-auto mx-auto"
          />
        </Card>
        <Slider
          max={range.max}
          min={range.min}
          step={1}
          className={"w-full transition-all cursor-pointer"}
          onValueChange={(val) => {
            setT(val[0]), setPlay(false);
          }}
          value={[t]}
        />
      </div>
    </div>
  );
};
