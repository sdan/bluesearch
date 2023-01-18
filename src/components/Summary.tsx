import Seo from '@/components/Seo';

export default function Example() {
  return (
    <div className='md:flex md:items-center md:justify-between'>
      <div className='min-w-0 flex-1'>
        <h2 className='text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight'>
          Back End Developer
        </h2>
      </div>
      <div className='mt-4 flex md:mt-0 md:ml-4'>
        <button
          type='button'
          className='inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800'
        >
          Edit
        </button>
        <button
          type='button'
          className='ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800'
        >
          Publish
        </button>
      </div>
    </div>
  );
}

export function OldSummary({
  pullSummary,
  timelineTrigger,
  triggerSummary,
  mutatingSummary,
  errorSummary,
  timelineData,
  timelineMutating,
  timelineError,
}) {
  return (
    <>
      <Seo templateTitle='Summary' />
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout flex flex-col items-center justify-center text-center text-black'>
            <h1 className='mt-8 text-4xl md:text-6xl'>
              Summary of your timeline
            </h1>
            <p className='mt-4 md:text-lg'>
              This page shows a summary of your timeline
            </p>
            <div className='mt-8'>
              <button
                className='rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700'
                onClick={() => timelineTrigger()}
              >
                Pull latest timeline
              </button>
            </div>
            <div className='mt-8'>
              <button
                className='rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700'
                onClick={() => triggerSummary()}
              >
                Summarize
              </button>
            </div>
            <div className='mt-8'>
              <h4 className='text-1xl mt-8 md:text-2xl'>
                <div
                  dangerouslySetInnerHTML={{ __html: pullSummary?.summary }}
                  style={{ whiteSpace: 'pre-line' }}
                />
              </h4>
              <p className='mt-4 md:text-lg'>
                {pullSummary?.summary == '' ? 'No summary yet' : ''}
              </p>
            </div>
            <div className='mt-8'>
              <h2 className='mt-8 text-4xl md:text-6xl'>
                {mutatingSummary ? 'Summarizing...' : ''}
              </h2>
            </div>
            <div className='mt-8'>
              <h2 className='mt-8 text-4xl md:text-6xl'>
                {timelineMutating ? 'Fetching timeline...' : ''}
              </h2>
            </div>
            <div className='mt-8'>
              <h2 className='mt-4 text-red-500 md:text-lg'>
                {errorSummary
                  ? 'Summary error \n' +
                    errorSummary.status +
                    '\n' +
                    errorSummary.info
                  : ''}
              </h2>
            </div>

            <div className='mt-8'>
              <h2 className='mt-4 text-red-500 md:text-lg'>
                {timelineError
                  ? 'Timeline error \n' +
                    timelineError.status +
                    '\n' +
                    timelineError.info
                  : ''}
              </h2>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
