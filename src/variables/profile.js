
const profile = {
    username: null,
    picture: null,
    uid: null
}

export const initializeProfile = () => {
    if(localStorage.getItem('profile')) {
        const buffer = JSON.parse(localStorage.getItem('profile'));
        profile.username = buffer.username;
        profile.picture = buffer.picture;
        profile.uid = buffer.uid;
    }
}

export const setProfile = (username, picture, uid) => {
    profile.username = username;
    profile.picture = picture;
    profile.uid = uid;
    if (username) {
        localStorage.setItem('profile', JSON.stringify(profile));
    } else {
        localStorage.removeItem('profile');
    }
}

export const getUsername = () => {
    return profile.username;
}

export const getProfilePicture = () => {
    return profile.picture;
}

export const getUid = () => {
    return profile.uid;
}
