export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Avatar utility to handle broken avatar.iran.liara.run URLs
export const getAvatarUrl = (profilePic, name = 'User') => {
    // Check if the URL is from the broken service or empty
    if (!profilePic || profilePic.includes('avatar.iran.liara.run')) {
        const encodedName = encodeURIComponent(name);
        return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=200`;
    }
    return profilePic;
};