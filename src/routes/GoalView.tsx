import { useTranslation } from 'react-i18next'

// import Timer from "../components/Timer"

export default function GoalView() {
  const { t } = useTranslation('translation', { keyPrefix: 'goal' })

  return (
    <div className="h-full">
      <div className="w-full px-5 mx-auto flex flex-col items-center h-full">
        <div className="w-full mt-8 text-center text-5xl text-white font-[800] tracking-tight font-['Outfit']">
          Animal Atlas
        </div>

        <div className="mt-12 text-lg text-[#a78bfa] font-medium tracking-wide select-none">{t("title")}</div>

        <div className="pt-5 text-center select-none">
          <p className="text-lg text-white leading-normal whitespace-pre" dangerouslySetInnerHTML={{ __html: t("text") }}>
          </p>
        </div>

        {/* <div className="w-full mt-auto">
          <div className="relative w-full h-[70px]">
            <Timer isFinished={true}></Timer>
          </div>
        </div> */}
      </div>
    </div>
  )
}