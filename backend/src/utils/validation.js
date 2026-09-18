const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const loginSchema = {
  validate: (data) => {
    if (!data.email || !validateEmail(data.email))
      return { error: { details: [{ message: 'Valid email is required' }] } };
    if (!data.password)
      return { error: { details: [{ message: 'Password is required' }] } };
    return { value: data };
  },
};

module.exports = { loginSchema };
