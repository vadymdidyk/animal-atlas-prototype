import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  setStartTime,
  setDuration,
  setTimeLeft,
  setTimeIsUp,
  setShowTimeNotice,
  setTimeNoticeChecked,
  setCompleteNoticeChecked,
  setIsModelCached as setIsModelCachedAction
} from '../store/sessionSlice';
import { sessionService } from '../services/SessionService';
import { minToMs } from '../utils';
import { appConfig } from '../config/app.config';

export function useSession() {
  const dispatch = useDispatch<AppDispatch>();

  const startTime = useSelector((state: RootState) => state.session.startTime);
  const duration = useSelector((state: RootState) => state.session.duration);
  const timeLeft = useSelector((state: RootState) => state.session.timeLeft);
  const timeIsUp = useSelector((state: RootState) => state.session.timeIsUp);
  const showTimeNotice = useSelector((state: RootState) => state.session.showTimeNotice);
  const timeNoticeChecked = useSelector((state: RootState) => state.session.timeNoticeChecked);
  const completeNoticeChecked = useSelector((state: RootState) => state.session.completeNoticeChecked);
  const isModelCached = useSelector((state: RootState) => state.session.isModelCached);

  const handleSetDuration = (value: number, callback?: () => void): void => {
    if (value) {
      dispatch(setDuration(value));
      sessionService.saveSessionOptions(
        { duration: value },
        startTime || Date.now()
      );

      callback?.();
    }
  }

  const handleSetStartTime = (time: number): void => {
    dispatch(setStartTime(time));
    sessionService.saveSessionOptions(
      { startTime: time },
      time
    );
  }

  const handleSetTimeNoticeChecked = (): void => {
    dispatch(setTimeNoticeChecked(true));
    sessionService.saveSessionOptions(
      { timeNoticeChecked: true },
      startTime
    );

    dispatch(setShowTimeNotice(false));
  }

  const handleSetCompleteNoticeChecked = (val: boolean): void => {
    dispatch(setCompleteNoticeChecked(val));
    sessionService.saveSessionOptions(
      { completeNoticeChecked: val },
      startTime
    );
  }

  const handleRemoveSessionOptions = (): void => {
    sessionService.removeSessionOptions();
    dispatch(setStartTime(0));
    dispatch(setDuration(0));
    dispatch(setTimeLeft(null));
    dispatch(setTimeIsUp(null));
    dispatch(setShowTimeNotice(false));
    dispatch(setTimeNoticeChecked(false));
    dispatch(setCompleteNoticeChecked(false));
  }

  useEffect(() => {
    if (!startTime || !duration) return;

    const interval = setInterval(() => {
      const fullDuration = duration * 60 * 1000;
      const currentTime = Date.now();
      const timeLeftVal = (startTime + fullDuration) - currentTime;

      if (timeLeftVal <= 0) {
        clearInterval(interval);
        dispatch(setTimeIsUp(true));
      }
      else if (timeLeftVal <= minToMs(appConfig.session.TIME_WARNING_MINUTES)) {
        dispatch(setShowTimeNotice(true));
      }
    }, 1000);


    return () => clearInterval(interval);
  }, [startTime, duration, dispatch]);

  const setIsModelCached = (val: boolean): void => {
    dispatch(setIsModelCachedAction(val));
  }

  return {
    startTime, handleSetStartTime,
    duration, handleSetDuration,
    timeIsUp,
    timeLeft,
    showTimeNotice,
    timeNoticeChecked,
    handleRemoveSessionOptions,
    handleSetTimeNoticeChecked,
    completeNoticeChecked,
    handleSetCompleteNoticeChecked,
    isModelCached, setIsModelCached
  };
}
