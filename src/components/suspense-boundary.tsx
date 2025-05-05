import {
  Suspense,
  Component,
  type ErrorInfo,
  type PropsWithChildren,
} from "react";
import { logger } from "@/utils";

type DisjointBooleanFlag<K extends string> = {
  [Key in K]: {
    [P in Key]: true;
  } & Partial<Record<Exclude<K, Key>, undefined>>;
}[K];

type ErrorLevel = DisjointBooleanFlag<
  "intentional" | "recoverable" | "unexpected" | "fatal"
>;

type Props = {
  error?: React.ReactNode;
  loading?: React.ReactNode;
  children?: React.ReactNode;
} & ErrorLevel;

export function SuspenseBoundary({
  children,
  loading,
  error,
  intentional,
  recoverable,
  unexpected,
}: Props) {
  const errorLevel = intentional
    ? "intentional"
    : recoverable
      ? "recoverable"
      : unexpected
        ? "unexpected"
        : "fatal";
  return (
    <ErrorBoundary fallback={error} errorLevel={errorLevel}>
      <Suspense fallback={loading}>{children}</Suspense>
    </ErrorBoundary>
  );
}

/* auxiliary component for error handling */

type ErrorBoundaryProps = PropsWithChildren<{
  fallback: React.ReactNode;
  errorLevel?: "intentional" | "recoverable" | "unexpected" | "fatal";
}>;

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, __error: error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    switch (this.props.errorLevel) {
      case "intentional":
        // Do nothing
        break;
      case "recoverable":
        logger.info?.(
          "ErrorBoundary caught",
          this.props.errorLevel,
          "-level error:",
          error,
          info.componentStack,
        );
        break;
      case "unexpected":
        logger.error?.(
          "ErrorBoundary caught",
          this.props.errorLevel,
          "-level error:",
          error,
          info.componentStack,
        );
        break;
      case "fatal":
        logger.error?.(
          "ErrorBoundary caught",
          this.props.errorLevel,
          "-level error:",
          error,
          info.componentStack,
        );
        break;
      default:
        logger.error?.(
          "ErrorBoundary caught",
          "unknown error level:",
          error,
          info.componentStack,
        );
        break;
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
