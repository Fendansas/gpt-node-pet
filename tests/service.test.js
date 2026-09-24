
import {NotFoundError} from "../app/errors/NotFoundError.js";
import {jest} from '@jest/globals'
import {ConflictError} from "../app/errors/ConflictError.js";
import {Unauthorized} from "../app/errors/Unauthorized.js";
import  {ForbiddenError} from "../app/errors/ForbiddenError.js"


const mockGetUserById = jest.fn();
const mockCreateUser = jest.fn();
const mockGetUserByEmail = jest.fn()
const mockGetUserByEmailWithPassword = jest.fn();
const mockUpdateUser = jest.fn()

const mockCompare = jest.fn();
const mockHash = jest.fn().mockResolvedValue('fake-hash')

process.env.JWT_SECRET = 'test-secret'

beforeEach(() => {
    jest.clearAllMocks();
});
jest.unstable_mockModule('../app/repositories/user.repository.js',()=>({
    default:{
        getUserById: mockGetUserById,
        createUser: mockCreateUser,
        getUserByEmail:mockGetUserByEmail,
        getUserByEmailWithPassword: mockGetUserByEmailWithPassword,
        updateUser: mockUpdateUser


    }
}))

jest.unstable_mockModule('bcrypt', ()=>({
    default:{
        compare:mockCompare,
        hash:mockHash
    }
}))

const {default: userService} =await import("../app/services/user.service.js");

test('Пользователь не найден', async () =>{
   mockGetUserById.mockResolvedValueOnce(null);

   await expect(userService.getUserById('123')).rejects.toThrow(NotFoundError);

})


test('Пользователь найден', async () =>{

    mockGetUserById.mockResolvedValueOnce({
        _id: '123',
        name: 'Sergey',
        email: 'sergey@test.com',
        role: 'admin',
        isActive: true
    })

    const user = await userService.getUserById('123')

    expect(user.id).toBe('123')
    expect(user.name).toBe('Sergey')
    expect(user.email).toBe('sergey@test.com')
    expect(user.role).toBe('admin')
    expect(user.isActive).toBe(true)
})


test('вызываем репозиторий', async () =>{

    mockGetUserById.mockResolvedValueOnce({
        _id: '123',
        name: 'Sergey',
        email: 'sergey@test.com',
        role: 'admin',
        isActive: true
    })

    const user = await userService.getUserById('123')

    expect(mockGetUserById).toHaveBeenCalledWith('123')

})


test('Создаем пользователя', async () =>{

    mockGetUserByEmail.mockResolvedValueOnce(null);

    mockCreateUser.mockResolvedValueOnce({
        _id: '123',
        name: 'Sergey',
        email: 'sergey@test.com',
        password: '1234567'
    })

    const user = await userService.createUser({
        name: 'Sergey',
        email: 'sergey@test.com',
        password: '1234567'
    });

    expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
            name: 'Sergey',
            email: 'sergey@test.com',
            password: expect.any(String)
        })
    )

    expect(user.id).toBe('123')
    expect(user.name).toBe('Sergey')
    expect(user.email).toBe('sergey@test.com')

})

test('Емеил уже используется', async () =>{

    mockGetUserByEmail.mockResolvedValueOnce({
        _id: '123',
        email: 'sergey@test.com'
    });



    await expect(

        userService.createUser({
            name: 'Sergey',
            email: 'sergey@test.com',
            password: '1234567'
        })

    ).rejects.toThrow(ConflictError);

    expect(mockCreateUser).not.toHaveBeenCalled()

})

test('Тестируем логин, пользователь не найден', async () =>{

    mockGetUserByEmailWithPassword.mockResolvedValueOnce(null);

    await expect(

        userService.loginUser({
            email: 'sergey@test.com',
            password: '1234567'
        })

    ).rejects.toThrow(NotFoundError);

})

test('Пользователь найден, но пароль неправильный', async () =>{

    mockGetUserByEmailWithPassword.mockResolvedValueOnce({
        _id: '123',
        name: 'Sergey',
        email: 'sergey@test.com',
        password: 'hashed-password',
        isActive: true
    })

    mockCompare.mockResolvedValueOnce(false);

    await expect(
        userService.loginUser({
            email: 'sergey@test.com',
            password: '123456'
        })
    ).rejects.toThrow(Unauthorized)

})

test('Пользователь найден, но деактевирован', async () =>{

    mockGetUserByEmailWithPassword.mockResolvedValueOnce({
        _id: '123',
        name: 'Sergey',
        email: 'sergey@test.com',
        password: 'hashed-password',
        isActive: false
    })

    await expect(
        userService.loginUser({
            email: 'sergey@test.com',
            password: '123456'
        })
    ).rejects.toThrow(ForbiddenError);

    expect(mockCompare).not.toHaveBeenCalled()

})

test('Пользователь найден, и залогинелся', async () =>{

    mockGetUserByEmailWithPassword.mockResolvedValueOnce({
        _id: '123',
        name: 'Sergey',
        email: 'sergey@test.com',
        password: 'hashed-password',
        isActive: true
    })


    const result = await userService.loginUser({
            email: 'sergey@test.com',
            password: '123456'
        })

    expect(result.user.id).toBe('123')
    expect(result.user.name).toBe('Sergey')
    expect(result.user.email).toBe('sergey@test.com')
    expect(result.user.isActive).toBe(true)
    expect(result.token).toEqual(expect.any(String));

    expect(mockCompare).toHaveBeenCalledWith(
        '123456',
        'hashed-password'
    );


})

test('Изминение имени пользователя', async () =>{

    mockUpdateUser.mockResolvedValueOnce({
        _id: '123',
        name: 'sas',
        email: 'sergey@test.com',
        password: 'hashed-password',
        isActive: true
    })


    const result = await userService.updateUser('123',{
        name:'sas'
    })



    expect(mockUpdateUser).toHaveBeenCalledWith(
        '123',
        {name:'sas'})

    expect(result.name).toBe('sas')

})

test('Изминение емейла пользователя', async () =>{

    mockGetUserByEmail.mockResolvedValueOnce(null)

    mockUpdateUser.mockResolvedValueOnce({
        _id: '123',
        name: 'sas',
        email: 'new@test.com',
        password: 'hashed-password',
        isActive: true
    })


    const result = await userService.updateUser('123',{
        email:'new@test.com'
    })


    expect(mockGetUserByEmail).toHaveBeenCalledWith('new@test.com')
    expect(mockUpdateUser).toHaveBeenCalledWith(
        '123',
        {email:'new@test.com'})

    expect(result.email).toBe('new@test.com')

})


test('Email уже занят другим пользователем', async () =>{

    mockGetUserByEmail.mockResolvedValueOnce({_id: '124'})


    await expect(userService.updateUser('123', {
            email: 'new@test.com'
        })
    ).rejects.toThrow(ConflictError);

    expect(mockUpdateUser).not.toHaveBeenCalled()


})


test('Email меняем на такойже', async () =>{

    mockGetUserByEmail.mockResolvedValueOnce({_id: '123'})

    mockUpdateUser.mockResolvedValueOnce({
        _id: '123',
        email: 'new@test.com'
    })


    const result = await userService.updateUser('123', {
            email: 'new@test.com'
        })


    expect(mockGetUserByEmail).toHaveBeenCalledWith('new@test.com')

    expect(mockUpdateUser).toHaveBeenCalledWith(
        '123',
        { email: 'new@test.com' }
    )

    expect(result.email).toBe('new@test.com')

})






