import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div>
          <Skeleton className="h-36 w-36 rounded-full" />
        </div>

        <div className="mt-3">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="mt-3 h-7 w-20" />

          <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-9 w-36" />
            ))}
          </div>

          <Skeleton className="mt-8 h-7 w-9/12" />
        </div>
      </div>

      <div className="mb-12 mt-10">
        <Skeleton className="h-7 w-full" />

        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28" />
          ))}
        </div>
      </div>

      <div className="mt-10 flex gap-10">
        <div className="flex flex-1 flex-col">
          <div className="flex">
            {[1, 2].map((item) => (
              <Skeleton key={item} className="h-11 w-24" />
            ))}
          </div>

          <div className="mt-5 flex w-full flex-col gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-48 w-full" />
            ))}
          </div>
        </div>

        <div className="flex min-w-[278px] flex-col max-lg:hidden">
          <Skeleton className="h-7 w-10" />

          <div className="mt-7 flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-7" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
