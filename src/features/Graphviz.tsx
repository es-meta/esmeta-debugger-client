import { useCallback, useEffect, useMemo, useState } from 'react';
import { graphviz, GraphvizOptions } from 'd3-graphviz';
import { twJoin } from 'tailwind-merge';
import { LoaderIcon } from 'lucide-react';

interface IGraphvizProps {
  /**
   * A string containing a graph representation using the Graphviz DOT language.
   * @see https://graphviz.org/doc/info/lang.html
   */
  dot: string;
  /**
   * Options to pass to the Graphviz renderer.
   */
  options?: GraphvizOptions;
  /**
   * The classname to attach to this component for styling purposes.
   */
  className?: string;
}

const defaultOptions: GraphvizOptions = {
  fit: true,
  // height: 500,
  // width: 500,

  zoom: false,
};

let counter = 0;
 
const getId = () => `graphviz${counter++}`;

const Graphviz = ({ dot, className, options = {} }: IGraphvizProps) => {
  const id = useMemo(getId, []);

  const [lastCompleted, setLastCompleted] = useState('');
  // const notify = useCallback(, [dot]);
  

  // useEffect(() => {
  //   console.log('lastCompleted', lastCompleted);
  //   console.log('dot', dot);
  //   console.log('lastCompleted === dot', lastCompleted === dot);
  //   setDeferred(lastCompleted === dot);
  // }, [lastCompleted, dot]);

  useEffect(() => {

    graphviz(`#${id}`, {
      ...defaultOptions,
      ...options,
    }).renderDot(dot, () => {
      console.log('rendered');
      setTimeout(() => { setLastCompleted(dot) }, 0);
    });

  }, [dot, options]);

  return <div className='relative [&>&>svg]:size-full size-full'>
      <div className={twJoin('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2')}>
        <LoaderIcon className={lastCompleted === dot ? 'hidden' : 'animate-spin'} />
      </div>
      <div className={className} id={id} />
    </div>
};

export { Graphviz, type IGraphvizProps };
export default Graphviz;