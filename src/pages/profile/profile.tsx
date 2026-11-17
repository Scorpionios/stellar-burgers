import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { updateUserThunk } from '@services/auth';
import { useSelector, useDispatch } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const updateData: { name: string; email: string; password?: string } = {
      name: formValue.name,
      email: formValue.email,
    };

    if (formValue.password) {
      updateData.password = formValue.password;
    }

    void dispatch(updateUserThunk(updateData))
      .unwrap()
      .then(() => {
        setFormValue({
          name: updateData?.name ?? '',
          email: updateData?.email ?? '',
          password: '',
        });
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        updateUserError={error?.message}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </>
  );
};
