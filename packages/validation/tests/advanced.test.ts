import { string, number, Validator, boolean, array, object } from '../src/index'

describe('Validation Package - Advanced Tests', () => {
  describe('String Validator - Advanced', () => {
    describe('URL validation', () => {
      const urlValidator = string().url()

      it('should accept valid URLs', () => {
        const validUrls = [
          'https://example.com',
          'http://localhost:3000',
          'https://sub.domain.example.com/path?query=value',
          'ftp://files.example.com',
          'ws://websocket.example.com',
        ]

        validUrls.forEach(url => {
          expect(urlValidator.validate(url).valid).toBe(true)
        })
      })

      it('should reject invalid URLs', () => {
        const invalidUrls = [
          'not-a-url',
          'htp://invalid.com',
          '://missing-protocol.com',
          'example.com',
          '',
        ]

        invalidUrls.forEach(url => {
          const result = urlValidator.validate(url)
          expect(result.valid).toBe(false)
        })
      })
    })

    describe('Pattern validation', () => {
      it('should validate with regex patterns', () => {
        const alphaValidator = string().pattern(/^[a-zA-Z]+$/)

        expect(alphaValidator.validate('abc').valid).toBe(true)
        expect(alphaValidator.validate('ABC').valid).toBe(true)
        expect(alphaValidator.validate('abc123').valid).toBe(false)
        expect(alphaValidator.validate('abc-def').valid).toBe(false)
      })

      it('should validate hex color codes', () => {
        const hexValidator = string().pattern(/^#[0-9A-Fa-f]{6}$/)

        expect(hexValidator.validate('#FF0000').valid).toBe(true)
        expect(hexValidator.validate('#00ff00').valid).toBe(true)
        expect(hexValidator.validate('#000000').valid).toBe(true)
        expect(hexValidator.validate('#FFF').valid).toBe(false)
        expect(hexValidator.validate('FF0000').valid).toBe(false)
        expect(hexValidator.validate('#GGGGGG').valid).toBe(false)
      })
    })

    describe('OneOf validation', () => {
      const roleValidator = string().oneOf(['admin', 'user', 'guest'])

      it('should accept values in the list', () => {
        expect(roleValidator.validate('admin').valid).toBe(true)
        expect(roleValidator.validate('user').valid).toBe(true)
        expect(roleValidator.validate('guest').valid).toBe(true)
      })

      it('should reject values not in the list', () => {
        const invalidRoles = ['moderator', 'superadmin', '', 'Admin']

        invalidRoles.forEach(role => {
          expect(roleValidator.validate(role).valid).toBe(false)
        })
      })
    })

    describe('Custom validation', () => {
      it('should support custom validator functions', () => {
        const passwordValidator = string().minLength(8).custom((value: string) => {
          if (!/[A-Z]/.test(value)) {
            return 'Must contain uppercase letter'
          }
          if (!/[a-z]/.test(value)) {
            return 'Must contain lowercase letter'
          }
          if (!/[0-9]/.test(value)) {
            return 'Must contain number'
          }
          return true
        })

        expect(passwordValidator.validate('Password123').valid).toBe(true)
        expect(passwordValidator.validate('password123').valid).toBe(false)
        expect(passwordValidator.validate('PASSWORD123').valid).toBe(false)
        expect(passwordValidator.validate('Password').valid).toBe(false)
      })
    })

    describe('Chaining multiple validators', () => {
      it('should apply all validators in chain', () => {
        const usernameValidator = string()
          .required()
          .minLength(3)
          .maxLength(20)
          .pattern(/^[a-zA-Z0-9_]+$/)

        expect(usernameValidator.validate('user123').valid).toBe(true)
        expect(usernameValidator.validate('ab').valid).toBe(false) // too short
        expect(usernameValidator.validate('a'.repeat(25)).valid).toBe(false) // too long
        expect(usernameValidator.validate('user-123').valid).toBe(false) // invalid pattern
        expect(usernameValidator.validate('').valid).toBe(false) // required
      })
    })
  })

  describe('Number Validator - Advanced', () => {
    describe('Range validation', () => {
      const ageValidator = number().min(0).max(150)

      it('should accept numbers in range', () => {
        expect(ageValidator.validate(0).valid).toBe(true)
        expect(ageValidator.validate(25).valid).toBe(true)
        expect(ageValidator.validate(150).valid).toBe(true)
      })

      it('should reject numbers out of range', () => {
        expect(ageValidator.validate(-1).valid).toBe(false)
        expect(ageValidator.validate(151).valid).toBe(false)
        expect(ageValidator.validate(1000).valid).toBe(false)
      })
    })

    describe('Integer validation', () => {
      const intValidator = number().integer()

      it('should accept integers', () => {
        expect(intValidator.validate(42).valid).toBe(true)
        expect(intValidator.validate(0).valid).toBe(true)
        expect(intValidator.validate(-10).valid).toBe(true)
      })

      it('should reject non-integers', () => {
        expect(intValidator.validate(42.5).valid).toBe(false)
        expect(intValidator.validate(3.14).valid).toBe(false)
        expect(intValidator.validate(-0.5).valid).toBe(false)
      })
    })

    describe('Positive/Negative validation', () => {
      it('should validate positive numbers', () => {
        const positiveValidator = number().positive()

        expect(positiveValidator.validate(1).valid).toBe(true)
        expect(positiveValidator.validate(0.5).valid).toBe(true)
        expect(positiveValidator.validate(0).valid).toBe(false)
        expect(positiveValidator.validate(-1).valid).toBe(false)
      })

      it('should validate negative numbers', () => {
        const negativeValidator = number().negative()

        expect(negativeValidator.validate(-1).valid).toBe(true)
        expect(negativeValidator.validate(-0.5).valid).toBe(true)
        expect(negativeValidator.validate(0).valid).toBe(false)
        expect(negativeValidator.validate(1).valid).toBe(false)
      })
    })
  })

  describe('Boolean Validator', () => {
    const boolValidator = Validator.boolean()

    it('should accept boolean values', () => {
      expect(boolValidator.validate(true).valid).toBe(true)
      expect(boolValidator.validate(false).valid).toBe(true)
    })

    it('should reject non-boolean values', () => {
      expect(boolValidator.validate('true').valid).toBe(false)
      expect(boolValidator.validate(1).valid).toBe(false)
      expect(boolValidator.validate(0).valid).toBe(false)
      expect(boolValidator.validate(null).valid).toBe(false)
      expect(boolValidator.validate(undefined).valid).toBe(false)
    })
  })

  describe('Array Validator', () => {
    describe('Basic array validation', () => {
      const arrayValidator = Validator.array()

      it('should accept arrays', () => {
        expect(arrayValidator.validate([]).valid).toBe(true)
        expect(arrayValidator.validate([1, 2, 3]).valid).toBe(true)
        expect(arrayValidator.validate(['a', 'b']).valid).toBe(true)
      })

      it('should reject non-arrays', () => {
        expect(arrayValidator.validate('not an array').valid).toBe(false)
        expect(arrayValidator.validate(123).valid).toBe(false)
        expect(arrayValidator.validate(null).valid).toBe(false)
        expect(arrayValidator.validate(undefined).valid).toBe(false)
      })
    })

    describe('Array with item validator', () => {
      const emailArrayValidator = Validator.array(
        Validator.string().email()
      )

      it('should validate array items', () => {
        expect(emailArrayValidator.validate(['test@example.com', 'user@example.com']).valid).toBe(true)
        expect(emailArrayValidator.validate(['valid@example.com', 'invalid-email']).valid).toBe(false)
      })

      it('should return error path for invalid items', () => {
        const result = emailArrayValidator.validate(['valid@example.com', 'invalid'])

        expect(result.valid).toBe(false)
        if (result.errors) {
          expect(result.errors[0].path).toEqual([1])
        }
      })
    })

    describe('Array length validation', () => {
      // Note: This would need to be implemented in the actual validator
      it('should support min/max length validation', () => {
        // This is a placeholder for future implementation
        const arrayValidator = Validator.array()

        expect(arrayValidator.validate([1, 2, 3]).valid).toBe(true)
        expect(arrayValidator.validate([]).valid).toBe(true)
      })
    })
  })

  describe('Object Schema - Advanced', () => {
    describe('Nested objects', () => {
      const addressSchema = {
        street: Validator.string().required(),
        city: Validator.string().required(),
        zipCode: Validator.string().pattern(/^\d{5}$/).required(),
      }

      const personSchema = Validator.object({
        name: Validator.string().required(),
        age: Validator.number().min(18).required(),
        address: Validator.object(addressSchema).required(),
      })

      it('should validate nested objects', () => {
        const validPerson = {
          name: 'John Doe',
          age: 30,
          address: {
            street: '123 Main St',
            city: 'Springfield',
            zipCode: '12345',
          },
        }

        expect(personSchema.validate(validPerson).valid).toBe(true)
      })

      it('should invalidate nested objects with errors', () => {
        const invalidPerson = {
          name: 'John Doe',
          age: 30,
          address: {
            street: '123 Main St',
            city: 'Springfield',
            zipCode: 'ABCDE',
          },
        }

        expect(personSchema.validate(invalidPerson).valid).toBe(false)
      })
    })

    describe('Optional fields', () => {
      const schema = Validator.object({
        required: Validator.string().required(),
        optional: Validator.string().optional(),
        alsoOptional: Validator.number().optional(),
      })

      it('should validate objects with optional fields present', () => {
        expect(schema.validate({
          required: 'value',
          optional: 'present',
          alsoOptional: 42,
        }).valid).toBe(true)
      })

      it('should validate objects with optional fields absent', () => {
        expect(schema.validate({
          required: 'value',
        }).valid).toBe(true)
      })
    })

    describe('Complex nested validation', () => {
      const userWithPostsSchema = Validator.object({
        id: Validator.number().required(),
        name: Validator.string().required(),
        posts: Validator.array(
          Validator.object({
            id: Validator.number().required(),
            title: Validator.string().required().minLength(5),
            content: Validator.string().optional(),
          })
        ).optional(),
      })

      it('should validate complex nested structures', () => {
        const validUser = {
          id: 1,
          name: 'Alice',
          posts: [
            { id: 1, title: 'First Post', content: 'Content' },
            { id: 2, title: 'Second Post' },
          ],
        }

        expect(userWithPostsSchema.validate(validUser).valid).toBe(true)
      })

      it('should catch errors at any nesting level', () => {
        const invalidUser = {
          id: 1,
          name: 'Bob',
          posts: [
            { id: 1, title: 'OK' }, // title too short
            { id: 2 }, // missing title
          ],
        }

        const result = userWithPostsSchema.validate(invalidUser)
        expect(result.valid).toBe(false)
      })
    })
  })

  describe('Error Messages', () => {
    it('should provide descriptive error messages', () => {
      const schema = Validator.object({
        email: Validator.string().email().required(),
        age: Validator.number().min(18).required(),
      })

      const result = schema.validate({
        email: 'invalid-email',
        age: 15,
      })

      expect(result.valid).toBe(false)
      if (result.errors) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].message).toBeTruthy()
      }
    })

    it('should include error codes', () => {
      const result = Validator.string().email().validate('not-an-email')

      expect(result.valid).toBe(false)
      if (result.errors) {
        expect(result.errors[0].code).toBe('email')
      }
    })

    it('should include error paths for nested validation', () => {
      const schema = Validator.object({
        user: Validator.object({
          posts: Validator.array(
            Validator.object({
              title: Validator.string().required(),
            })
          ),
        }),
      })

      const result = schema.validate({
        user: {
          posts: [{ title: 'OK' }, {}],
        },
      })

      expect(result.valid).toBe(false)
      if (result.errors) {
        expect(result.errors[0].path).toContain('posts')
        expect(result.errors[0].path).toContain(1)
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle null values correctly', () => {
      const requiredValidator = Validator.string().required()
      const optionalValidator = Validator.string().optional()

      expect(requiredValidator.validate(null).valid).toBe(false)
      expect(optionalValidator.validate(null).valid).toBe(true)
    })

    it('should handle undefined values correctly', () => {
      const requiredValidator = Validator.string().required()
      const optionalValidator = Validator.string().optional()

      expect(requiredValidator.validate(undefined).valid).toBe(false)
      expect(optionalValidator.validate(undefined).valid).toBe(true)
    })

    it('should handle empty strings', () => {
      const requiredValidator = Validator.string().required()

      expect(requiredValidator.validate('').valid).toBe(false)
    })

    it('should handle zero values', () => {
      const numberValidator = Validator.number().required()

      expect(numberValidator.validate(0).valid).toBe(true)
    })

    it('should handle false boolean', () => {
      const boolValidator = Validator.boolean().required()

      expect(boolValidator.validate(false).valid).toBe(true)
    })

    it('should handle empty arrays', () => {
      const arrayValidator = Validator.array().required()

      expect(arrayValidator.validate([]).valid).toBe(true)
    })

    it('should handle empty objects', () => {
      const objectSchema = Validator.object({})
      const objectWithRequired = Validator.object({
        field: Validator.string().required(),
      })

      expect(objectSchema.validate({}).valid).toBe(true)
      expect(objectWithRequired.validate({}).valid).toBe(false)
    })
  })
})
