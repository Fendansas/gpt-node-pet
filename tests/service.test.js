
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
const mockDeactivateUser = jest.fn();
const mockIncrementTokenVersion = jest.fn();
const mockActivateUser = jest.fn();
const mockGetUsersAssignable = jest.fn();

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
        updateUser: mockUpdateUser,
        deactivateUser: mockDeactivateUser,
        incrementTokenVersion: mockIncrementTokenVersion,
        activateUser: mockActivateUser,
        getUsersAssignable: mockGetUsersAssignable

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


test('Деактивация пользователя', async () =>{



    mockDeactivateUser.mockResolvedValueOnce({
        _id: '123',
        name: 'sas',
        email: 'new@test.com',
        isActive: false
    })


    const result = await userService.deactivateUser('123')


    expect(mockDeactivateUser).toHaveBeenCalledWith('123')
    expect(mockIncrementTokenVersion).toHaveBeenCalledWith('123')
    expect(result.email).toBe('new@test.com')
    expect(result.isActive).toBe(false)

})

test('Пользователь для деактивации не найден', async () =>{

    mockDeactivateUser.mockResolvedValueOnce(null)


    await expect(userService.deactivateUser('123')).rejects.toThrow(NotFoundError)

    expect(mockIncrementTokenVersion).not.toHaveBeenCalled()
})


test('Активация пользователя', async () =>{



    mockActivateUser.mockResolvedValueOnce({
        _id: '123',
        name: 'sas',
        email: 'new@test.com',
        isActive: true
    })


    const result = await userService.activateUser('123')


    expect(mockActivateUser).toHaveBeenCalledWith('123')

    expect(result.email).toBe('new@test.com')
    expect(result.isActive).toBe(true)

})

test('Пользователь для активации не найден', async () =>{

    mockActivateUser.mockResolvedValueOnce(null)


    await expect(userService.activateUser('123')).rejects.toThrow(NotFoundError)

    expect(mockActivateUser).toHaveBeenCalledWith('123')
})


test('Выход со всех устройств', async () =>{

    mockIncrementTokenVersion.mockResolvedValueOnce({
        _id: '123',
        name: 'sas',
        email: 'new@test.com',
        isActive: true
    })


    await userService.logoutAll('123')
    expect(mockIncrementTokenVersion).toHaveBeenCalledWith('123')

})

test('Выход со всех устройств пользоветль не найден', async () =>{

    mockIncrementTokenVersion.mockResolvedValueOnce(null)

    await expect(userService.logoutAll('123')).rejects.toThrow(NotFoundError)
    expect(mockIncrementTokenVersion).toHaveBeenCalledWith('123')


})

test('Получить пользователя для асайна', async () => {

    mockGetUsersAssignable.mockResolvedValueOnce([
            {
                _id: '123',
                name: 'sas',
            },
            {
                _id: '124',
                name: 'sas1',
            },
            {
                _id: '125',
                name: 'sas2',
            },
        ]
    )


    const result = await userService.getUsersAssignable()
    expect(result).toHaveLength(3)

    expect(result[0]._id).toBe('123')
    expect(result[0].name).toBe('sas')

    expect(result[1]._id).toBe('124')
    expect(result[1].name).toBe('sas1')

    expect(result[2]._id).toBe('125')
    expect(result[2].name).toBe('sas2')

    expect(mockGetUsersAssignable).toHaveBeenCalled()

})

