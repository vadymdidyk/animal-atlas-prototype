import { Routes, Route, useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"

import { appConfig } from "./config/app.config"

import RootView from "./routes/RootView"
import IdleView from "./routes/IdleView"
import GoalView from "./routes/GoalView"
import CollectionView from "./routes/CollectionView"
import CollectionDetailView from "./routes/CollectionDetailView"
import CameraView from "./routes/CameraView"

import PageTransitionWrap from "./components/common/PageTransitionWrap"
import AnimatedBackground from "./components/common/AnimatedBackground"
import ErrorBoundary from "./components/common/ErrorBoundary"

function App() {
  const location = useLocation()

  return (
    <div className="relative h-dvh w-full mx-auto z-[1] overflow-x-hidden">
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <Routes key={location.pathname} location={location}>
            <Route path={appConfig.routes.ROOT} element={<PageTransitionWrap><RootView /></PageTransitionWrap>} />
            <Route path={appConfig.routes.IDLE} element={<IdleView />} />
            <Route path={appConfig.routes.GOAL} element={<PageTransitionWrap><GoalView /></PageTransitionWrap>} />
            <Route path={appConfig.routes.COLLECTION} element={<CollectionView />} />
            <Route path={appConfig.routes.COLLECTION_DETAIL} element={<PageTransitionWrap><CollectionDetailView /></PageTransitionWrap>} />
            <Route path={appConfig.routes.CAMERA} element={<PageTransitionWrap><CameraView /></PageTransitionWrap>} />
          </Routes>
        </AnimatePresence>
      </ErrorBoundary>
      <AnimatedBackground />
    </div>
  )
}

export default App