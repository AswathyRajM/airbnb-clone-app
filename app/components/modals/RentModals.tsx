'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import Modal from './Modal';
import { useRentModal } from '@/app/hooks/userRentModal';
import Heading from '../Heading';
import { categories } from '../navbar/Categories/Categories';
import CategoryInput from '../inputs/CategoryInput';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import CountrySelect from '../inputs/CountrySelect';
import Counter from '../Counter';
import ImageUploads from '../inputs/ImageUploads';
import Input from '../inputs/Input';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setImageIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [
        {
          thumbnail: '',
          url: '',
          original_filename: '',
          asset_id: '',
          public_id: '',
        },
      ],
      price: 1,
      title: '',
      description: '',
    },
  });

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

  const Map = useMemo(
    () => dynamic(() => import('../Map'), { ssr: false }),
    [location]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const removeImage = (asset_id: string) => {
    const newImageSrc = imageSrc.filter(
      (img: any) => img.asset_id !== asset_id
    );

    setCustomValue('imageSrc', newImageSrc);
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) return onNext();

    setIsLoading(true);

    axios
      .post('/api/listings', data)
      .then((res) => {
        toast.success('Listing created!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch((e) => {
        toast.error('Something went wrong');
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE)
      return (
        <p className='flex align-baseline justify-center gap-1 w-full'>
          {isLoading ? (
            <>
              Creating
              <span className='animate-spin p-1'>
                <AiOutlineLoading3Quarters />
              </span>
            </>
          ) : (
            'Create'
          )}
        </p>
      );
    return 'Next';
  }, [step, isLoading]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) return undefined;
    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className='flex flex-col gap-8 '>
      <Heading
        title='Which of these describes your place?'
        subtitle='Pick a category'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
        {categories.map((item) => (
          <div key={item.label} className='col-span-1'>
            <CategoryInput
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Where is your place located?'
          subtitle='Help guests find you'
        />
        <CountrySelect
          onChange={(value) => {
            setCustomValue('location', value);
          }}
          value={location}
        />
        <Map center={location?.latlng} />
      </div>
    );
  } else if (step === STEPS.INFO) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Share some basics about your place'
          subtitle='What amenities do you have?'
        />
        <Counter
          title='Guests'
          subtitle='How many guests do you allow?'
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount', value)}
        />
        <hr />
        <Counter
          title='Rooms'
          subtitle='How many rooms do you have?'
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount', value)}
        />
        <hr />
        <Counter
          title='Bathrooms'
          subtitle='How many bathrooms do you have?'
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount', value)}
        />
      </div>
    );
  } else if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Add a photo of your place'
          subtitle='Show guests what your place looks like!'
        />
        <ImageUploads
          value={imageSrc}
          onChange={(value) => setCustomValue('imageSrc', value)}
          fileLimit={4}
          setIsLoading={setImageIsLoading}
          isLoading={isImageLoading}
          removeImage={removeImage}
        />
      </div>
    );
  } else if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='How would you describe your place?'
          subtitle='Short and sweet works best!'
        />
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  } else if (step === STEPS.PRICE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Now, set your price'
          subtitle='How much do you charge per night?!'
        />
        <Input
          id='price'
          label='Price'
          formatPrice
          type='number'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      title='Airbnb your home!'
      isOpen={rentModal.isOpen}
      onClose={() => {
        reset();
        rentModal.onClose();
      }}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={STEPS.CATEGORY === step ? undefined : onBack}
      body={bodyContent}
      disabled={isImageLoading || isLoading}
    />
  );
};

export default RentModal;
