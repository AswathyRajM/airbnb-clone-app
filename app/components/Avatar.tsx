import Image from 'next/image';

interface AvatarProps {
  src: string | null | undefined;
}

function Avatar(props: AvatarProps) {
  return (
    <Image
      alt='Avatar'
      className='rounded-full'
      src={props.src || '/images/placeholder.jpg'}
      height='30'
      width='30'
    />
  );
}

export default Avatar;
