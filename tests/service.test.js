
import {NotFoundError} from "../app/errors/NotFoundError.js";
import {jest} from '@jest/globals'
import {ConflictError} from "../app/errors/ConflictError.js";


const mockGetUserById = jest.fn();
const mockCreateUser = jest.fn();
const mockGetUserByEmail = jest.fn()

beforeEach(() => {
    jest.clearAllMocks();
});
jest.unstable_mockModule('../app/repositories/user.repository.js',()=>({
    default:{
        getUserById: mockGetUserById,
        createUser: mockCreateUser,
        getUserByEmail:mockGetUserByEmail

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




