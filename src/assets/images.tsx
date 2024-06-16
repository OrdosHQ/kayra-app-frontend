import Image from 'next/image';
import puzzle from './icons/puzzle.png';
import leo from './icons/leo.png';

const Puzzle = () => {
    return <Image src={puzzle} alt="puzzle icon" />;
};

const Leo = () => {
    return <Image src={leo} alt="leo icon" />;
};

export { Puzzle, Leo };
