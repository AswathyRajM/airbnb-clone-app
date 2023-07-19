import Image from 'next/image';

function Avatar() {
  return (
    <Image
      alt='Avatar'
      className='rounded-full'
      src='/images/placeholder.jpg'
      height='30'
      width='30'
    />
  );
}

export default Avatar;
