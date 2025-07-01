import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

let logoutTimer;

export const useAuth = () => {
  const history = useHistory();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);

  const login = useCallback(
    (uid, token, name, image, expirationDate) => {
      setToken(token);
      setUserId(uid);
      setName(name || null);
      setImage(image || null);
      const tokenExpiration =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpiration);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          name: name || null,
          image: image || null,
          expiration: tokenExpiration.toISOString()
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    setName(null);
    setImage(null);
    localStorage.removeItem('userData');
    history.push('/auth');
  }, [history]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.name,
        storedData.image,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        logout();
        history.push('/auth');
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate, history]);

  return { token, login, logout, userId, name, image };
};