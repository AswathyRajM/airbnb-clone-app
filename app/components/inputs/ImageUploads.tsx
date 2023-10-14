'use client';
import { thumbnailGenerator } from '@/app/helpers/thumbnailGenerator';
import axios from 'axios';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TbPhotoPlus } from 'react-icons/tb';
import { TiDelete } from 'react-icons/ti';

declare global {
  var cloudinary: any;
}

interface ImageUrls {
  thumbnail: string;
  url: string;
  original_filename: string;
  asset_id: string;
}

interface ImageUploadsProps {
  onChange: (value: string[]) => void;
  value: ImageUrls[];
  fileLimit: number;
}
const ImageUploads: React.FC<ImageUploadsProps> = ({
  onChange,
  value,
  fileLimit = 1,
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  const hanleUpload = useCallback(
    async (e: any) => {
      setError('');
      const files = [...e.target.files];

      if (files.length > fileLimit) {
        setError(`You can only upload upto ${fileLimit} images`);
        return;
      } else if (files.length === 0) {
        setError(`Upload atleast 1 image`);
        return;
      }

      const data = new FormData();
      data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
      data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_BUCKET!);
      data.append('folder', 'listing_images');

      const promises: any = [];
      for (let i = 0; i < files.length; i++) {
        data.append('file', e.target.files[i]);

        let promise;
        promise = new Promise((resolve: any, reject: any) => {
          axios
            .post(process.env.NEXT_PUBLIC_CLOUDINRY_URL! + '/upload', data)
            .then((res) => {
              resolve({
                url: res.data.url,
                original_filename: res.data.original_filename,
                asset_id: res.data.asset_id,
              });
            })
            .catch((e) => {
              reject(e.message);
            });
        });
        promises.push(promise);
      }

      Promise.all(promises)
        .then((res: any) => {
          res.forEach((url: any, i: number) => {
            res[i] = {
              ...url,
              thumbnail: thumbnailGenerator(url.url),
            };
          });
          onChange(res);
          toast.success('Images successfully uploaded!');
        })
        .catch((e: any) => {
          toast.error('Something went wrong while uploading images');
        });
    },
    [onChange]
  );
  return (
    <div
      className={`relative cursor-pointer rounded-lg overflow-hidden ${
        !value[0].url ? 'hover:opacity-70 ' : 'cursor-default'
      } transition border-2 p-2 border-neutral-300 flex flex-col justify-center items-center text-neutral-600`}
    >
      {value[0].url ? (
        <div className='flex flex-wrap items-start justify-start w-full'>
          {value.map((src: ImageUrls) => {
            return (
              <div
                key={src.asset_id}
                className='p-2 relative rounded-md flex-1 border-2 border-transparent hover:border-gray-200'
              >
                <div className='absolute right-0 top-0 cursor-pointer p-1 m-1 bg-slate-400'>
                  <TiDelete />
                </div>
                <Image
                  alt={src.original_filename}
                  width={120}
                  height={120}
                  src={src.thumbnail}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className='p-20 flex flex-col justify-center items-center gap-4'>
          <input
            className='absolute inset-0 -top-10 cursor-pointer'
            id='fileupload'
            type='file'
            accept='image/png, image/jpg, image/jpeg'
            multiple={fileLimit > 1}
            onChange={hanleUpload}
          />
          <TbPhotoPlus size={50} />
          <div className='text-center'>
            <label className='font-semibold text-lg block'>
              Click to upload images
            </label>
            <label className='text-sm font-light text-neutral-500 block'>
              Upload upto {fileLimit} images. Only supports .jpeg, .jpg, .png
            </label>
            <div className='text-sm font-light text-red-500 block'>{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploads;
